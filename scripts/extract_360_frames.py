#!/usr/bin/env python3
"""
Prestige Drive — 360° Frame Extractor
Works with PyAV (fast, pre-built wheels) OR opencv-python-headless.
Falls back gracefully between the two.

Usage:
    python scripts/extract_360_frames.py \
        --video public/videos/revuelto.mp4 \
        --id lamborghini-revuelto \
        --frames 72 \
        --scale 0.5 \
        --quality 85
"""

import argparse
import os
import sys
import numpy as np
from pathlib import Path
from PIL import Image

# Try PyAV first (fast), fallback to OpenCV
try:
    import av
    USE_AV = True
    print("Using PyAV for video decoding")
except ImportError:
    import cv2
    USE_AV = False
    print("Using OpenCV for video decoding")


def remove_dark_background(frame_np: np.ndarray, threshold: int = 15,
                            close_size: int = 35, blur_radius: int = 5) -> np.ndarray:
    """
    Remove near-black studio background. Works with numpy arrays (H,W,3 BGR or RGB).
    Returns RGBA numpy array.
    """
    if USE_AV:
        import cv2 as _cv2
        # PyAV gives RGB, convert to BGR for OpenCV processing
        bgr = frame_np[:, :, ::-1].copy()
    else:
        bgr = frame_np

    h, w = bgr.shape[:2]
    gray = np.dot(bgr[..., :3], [0.114, 0.587, 0.299]).astype(np.uint8)

    import cv2 as _cv2
    _, rough = _cv2.threshold(gray, threshold, 255, _cv2.THRESH_BINARY)

    k_close = _cv2.getStructuringElement(_cv2.MORPH_ELLIPSE, (close_size, close_size))
    car_mask = _cv2.morphologyEx(rough, _cv2.MORPH_CLOSE, k_close)

    k_open = _cv2.getStructuringElement(_cv2.MORPH_ELLIPSE, (5, 5))
    car_mask = _cv2.morphologyEx(car_mask, _cv2.MORPH_OPEN, k_open)

    n_labels, labels, stats, _ = _cv2.connectedComponentsWithStats(car_mask)
    clean_mask = np.zeros((h, w), np.uint8)
    min_area = h * w * 0.01

    for i in range(1, n_labels):
        if stats[i, _cv2.CC_STAT_AREA] > min_area:
            clean_mask[labels == i] = 255

    k_size = blur_radius * 2 + 1
    soft_alpha = _cv2.GaussianBlur(clean_mask, (k_size, k_size), blur_radius * 0.5)

    # Build RGBA (Pillow format)
    if USE_AV:
        rgb = frame_np[:, :, :3]
    else:
        rgb = bgr[:, :, ::-1]  # BGR → RGB

    rgba = np.dstack([rgb, soft_alpha])
    return rgba


def get_frames_av(video_path: str, target_frames: int, scale: float):
    """Extract evenly-spaced frames using PyAV."""
    container = av.open(video_path)
    stream = container.streams.video[0]

    total = stream.frames
    if total == 0:
        # estimate from duration
        duration = float(stream.duration * stream.time_base)
        fps = float(stream.average_rate)
        total = int(duration * fps)

    orig_w = stream.width
    orig_h = stream.height
    out_w = int(orig_w * scale) // 2 * 2
    out_h = int(orig_h * scale) // 2 * 2

    print(f"Video: ~{total} frames, {orig_w}x{orig_h}")
    print(f"Output: {target_frames} frames, {out_w}x{out_h}")

    # Collect all frames (decode full video, pick evenly spaced)
    # For large videos, seek instead
    frames = []
    for packet in container.demux(stream):
        for frame in packet.decode():
            frames.append(frame)
            if len(frames) >= total + 1:
                break
        if len(frames) >= total + 1:
            break

    actual_total = len(frames)
    indices = [
        int(round(i * (actual_total - 1) / (target_frames - 1)))
        for i in range(target_frames)
    ]

    result = []
    for idx in indices:
        frame = frames[min(idx, actual_total - 1)]
        img = frame.to_image()  # PIL Image (RGB)
        if scale != 1.0:
            img = img.resize((out_w, out_h), Image.LANCZOS)
        result.append(np.array(img))

    container.close()
    return result, out_w, out_h


def get_frames_cv(video_path: str, target_frames: int, scale: float):
    """Extract evenly-spaced frames using OpenCV."""
    import cv2 as _cv2
    cap = _cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise FileNotFoundError(f"Cannot open: {video_path}")

    total = int(cap.get(_cv2.CAP_PROP_FRAME_COUNT))
    orig_w = int(cap.get(_cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(_cv2.CAP_PROP_FRAME_HEIGHT))
    out_w = int(orig_w * scale) // 2 * 2
    out_h = int(orig_h * scale) // 2 * 2

    print(f"Video: {total} frames, {orig_w}x{orig_h}")
    print(f"Output: {target_frames} frames, {out_w}x{out_h}")

    indices = [
        int(round(i * (total - 1) / (target_frames - 1)))
        for i in range(target_frames)
    ]

    result = []
    for idx in indices:
        cap.set(_cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            result.append(None)
            continue
        if scale != 1.0:
            frame = _cv2.resize(frame, (out_w, out_h), interpolation=_cv2.INTER_LANCZOS4)
        result.append(frame)

    cap.release()
    return result, out_w, out_h


def extract_frames(video_path: str, vehicle_id: str,
                   target_frames: int = 72, scale: float = 0.5,
                   quality: int = 85, threshold: int = 15,
                   close_size: int = 35, blur_radius: int = 5):

    output_dir = Path(f"public/vehicles/{vehicle_id}")
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*50}")
    print(f"Processing: {vehicle_id}")
    print(f"Video: {video_path}")
    print(f"{'='*50}")

    if USE_AV:
        frames, out_w, out_h = get_frames_av(video_path, target_frames, scale)
    else:
        frames, out_w, out_h = get_frames_cv(video_path, target_frames, scale)

    print(f"Background removal: threshold={threshold}, close={close_size}, blur={blur_radius}")
    print()

    import cv2 as _cv2
    scaled_close = max(15, int(close_size * scale))
    scaled_blur = max(3, int(blur_radius * scale))

    success = 0
    for i, frame in enumerate(frames):
        if frame is None:
            print(f"  [SKIP] Frame {i}")
            continue

        rgba = remove_dark_background(
            frame,
            threshold=threshold,
            close_size=scaled_close,
            blur_radius=scaled_blur
        )

        img = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
        out_path = output_dir / f"frame_{i:03d}.webp"
        img.save(str(out_path), 'WEBP', quality=quality, method=6)
        success += 1

        if i % 12 == 0:
            size_kb = out_path.stat().st_size / 1024
            coverage = (rgba[:, :, 3] > 128).sum() / rgba[:, :, 3].size * 100
            print(f"  [{i:03d}/{target_frames-1}] {size_kb:.0f}KB | car: {coverage:.0f}%")

    total_size = sum(f.stat().st_size for f in output_dir.glob("*.webp"))
    print(f"\n✓ {success}/{target_frames} frames — {total_size/1024/1024:.1f} MB total")
    print(f"✓ Saved to: {output_dir}/")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--video", required=True)
    parser.add_argument("--id", required=True, dest="vehicle_id")
    parser.add_argument("--frames", type=int, default=72)
    parser.add_argument("--scale", type=float, default=0.5)
    parser.add_argument("--quality", type=int, default=85)
    parser.add_argument("--threshold", type=int, default=15)
    parser.add_argument("--close-size", type=int, default=35)
    parser.add_argument("--blur", type=int, default=5)
    args = parser.parse_args()

    extract_frames(
        video_path=args.video,
        vehicle_id=args.vehicle_id,
        target_frames=args.frames,
        scale=args.scale,
        quality=args.quality,
        threshold=args.threshold,
        close_size=args.close_size,
        blur_radius=args.blur,
    )
