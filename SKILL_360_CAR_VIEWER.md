# SKILL: 360° Car Viewer — Dark Background Removal + Drag Rotation
# Inspired by Nate Herk's skill format — ultra-detailed, zero ambiguity.

---

## WHAT THIS SKILL DOES

Transform a **single 360° rotation video of a car** (filmed on dark/black studio background)
into a **premium interactive drag viewer** embedded in the Prestige Drive Next.js app.

Result: user drags left/right → car rotates smoothly. Auto-spins on load.
Like a Porsche/Ferrari configurator. Ultra-premium feel.

---

## WHEN TO USE THIS SKILL

User says any of:
- "J'ai la vidéo du [véhicule], ajoute-la à la flotte"
- "Voici la vidéo 360 de la voiture"
- "Intègre cette rotation dans le viewer"
- Uploads a `.mp4` / `.mov` / `.webm` of a car rotating on dark background

---

## REQUIRED INPUT

1. **A video file** — car rotating 360° on dark/black background (studio lighting)
   - Duration: ideally 5–15s
   - Background: near-pure black (RGB < 15,15,15 in corners)
   - Car: any angle, any color
2. **Vehicle ID** — the `id` from `src/lib/data.ts` (e.g. `lamborghini-revuelto`)

---

## OUTPUT STRUCTURE

```
public/
  vehicles/
    {vehicle-id}/
      frame_000.webp   ← 72 frames total (000 → 071)
      frame_001.webp
      ...
      frame_071.webp

src/
  components/
    ui/
      CarViewer360.tsx  ← The interactive React component
  app/
    vehicle/
      [slug]/
        page.tsx        ← Updated to use CarViewer360 instead of static image
```

---

## STEP 1 — VIDEO ANALYSIS

Before anything, run this Python analysis script to understand the video:

```python
# scripts/analyze_video.py
import cv2
import numpy as np
import subprocess, json

video_path = "path/to/video.mp4"

# Get metadata
result = subprocess.run(
    ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_streams', '-show_format', video_path],
    capture_output=True, text=True
)
data = json.loads(result.stdout)

for s in data['streams']:
    if s['codec_type'] == 'video':
        fps = eval(s['r_frame_rate'])  # e.g. "24/1" → 24.0
        total_frames = int(s.get('nb_frames', float(data['format']['duration']) * fps))
        width, height = int(s['width']), int(s['height'])
        print(f"Resolution: {width}x{height}")
        print(f"FPS: {fps}")
        print(f"Total frames: {total_frames}")
        print(f"Duration: {data['format']['duration']}s")

# Sample first frame — check background darkness
cap = cv2.VideoCapture(video_path)
cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
_, frame = cap.read()
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
corners = [gray[:10, :10].mean(), gray[:10, -10:].mean(), gray[-10:, :10].mean(), gray[-10:, -10:].mean()]
print(f"Corner brightness (expect < 10 for dark bg): {[round(c,1) for c in corners]}")
cap.release()
```

**From analysis, adapt these constants:**

| Variable | How to set it |
|---|---|
| `BG_THRESHOLD` | Corner brightness + 5 (e.g. corners=3 → threshold=8, but use 15 for safety) |
| `TARGET_FRAMES` | 72 minimum. If video < 100 total frames → use 48. If > 200 → use 90. |
| `OUTPUT_SCALE` | 0.5 (880px wide). If car has fine details (Cullinan grille) → use 0.65 |
| `WEBP_QUALITY` | 85 for normal, 90 for metallic paint (preserves reflections) |

---

## STEP 2 — EXTRACT & PROCESS FRAMES

### The extraction + background removal script

Save as `scripts/extract_360_frames.py` and run from project root:

```python
#!/usr/bin/env python3
"""
Prestige Drive — 360° Frame Extractor
Extracts evenly-spaced frames from a 360° car video,
removes the dark studio background, exports as WebP with alpha.

Usage:
    python scripts/extract_360_frames.py \
        --video public/videos/lamborghini-revuelto.mp4 \
        --id lamborghini-revuelto \
        --frames 72 \
        --scale 0.5 \
        --quality 85

Dependencies: pip install opencv-python-headless Pillow numpy
"""

import cv2
import numpy as np
import argparse
import os
from pathlib import Path

def remove_dark_background(frame: np.ndarray, threshold: int = 15, 
                            close_size: int = 35, blur_radius: int = 5) -> np.ndarray:
    """
    Remove near-black studio background from car frame.
    Returns BGRA image with transparent background.
    
    Args:
        frame: BGR input frame
        threshold: pixels below this luminance = background (tune per video)
        close_size: morphological closing kernel size (larger = fills more holes)
        blur_radius: alpha edge softness in pixels
    
    The algorithm:
    1. Luminance threshold → rough car mask
    2. Morphological CLOSE → fills dark tires, shadows, panel gaps  
    3. Connected components → keeps only car body (removes noise)
    4. Gaussian blur on alpha → feathered, anti-aliased edges
    """
    h, w = frame.shape[:2]
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Step 1: Rough mask — car = bright, background = dark
    _, rough = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)
    
    # Step 2: Close morphology — fills holes in dark tires/panels
    # Use ellipse kernel for organic car shapes
    k_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (close_size, close_size))
    car_mask = cv2.morphologyEx(rough, cv2.MORPH_CLOSE, k_close)
    
    # Step 3: Open morphology — removes small noise pixels
    k_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    car_mask = cv2.morphologyEx(car_mask, cv2.MORPH_OPEN, k_open)
    
    # Step 4: Keep only significant connected components (car body)
    n_labels, labels, stats, _ = cv2.connectedComponentsWithStats(car_mask)
    clean_mask = np.zeros((h, w), np.uint8)
    min_area = h * w * 0.01  # minimum 1% of frame = real object
    
    for i in range(1, n_labels):  # skip label 0 = background
        if stats[i, cv2.CC_STAT_AREA] > min_area:
            clean_mask[labels == i] = 255
    
    # Step 5: Soft feathered alpha edges (anti-aliasing)
    # blur_radius controls how soft the car silhouette edges are
    k_size = blur_radius * 2 + 1
    soft_alpha = cv2.GaussianBlur(clean_mask, (k_size, k_size), blur_radius * 0.5)
    
    # Build BGRA output
    rgba = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = soft_alpha
    return rgba


def extract_frames(video_path: str, vehicle_id: str, 
                   target_frames: int = 72, scale: float = 0.5,
                   quality: int = 85, threshold: int = 15,
                   close_size: int = 35, blur_radius: int = 5):
    """
    Main extraction pipeline.
    """
    # Setup output directory
    output_dir = Path(f"public/vehicles/{vehicle_id}")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Open video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise FileNotFoundError(f"Cannot open video: {video_path}")
    
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Calculate output dimensions (always even numbers for codec compat)
    out_w = int(orig_w * scale) // 2 * 2
    out_h = int(orig_h * scale) // 2 * 2
    
    print(f"Video: {total_frames} frames, {orig_w}x{orig_h}")
    print(f"Output: {target_frames} frames, {out_w}x{out_h}, WebP {quality}%")
    print(f"Output dir: {output_dir}/")
    print()
    
    # Calculate evenly-spaced frame indices for full 360°
    # Distribute across entire video duration for smooth rotation
    indices = [
        int(round(i * (total_frames - 1) / (target_frames - 1)))
        for i in range(target_frames)
    ]
    
    # Process each frame
    from PIL import Image
    import io
    
    success_count = 0
    for output_idx, frame_idx in enumerate(indices):
        # Seek to frame
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        
        if not ret:
            print(f"  [WARN] Could not read frame {frame_idx}, skipping")
            continue
        
        # Resize first (faster processing on smaller image)
        if scale != 1.0:
            frame = cv2.resize(frame, (out_w, out_h), interpolation=cv2.INTER_LANCZOS4)
        
        # Scale threshold-dependent params for new size
        scaled_close = max(15, int(close_size * scale))
        scaled_blur = max(3, int(blur_radius * scale))
        
        # Remove background
        rgba = remove_dark_background(
            frame, 
            threshold=threshold,
            close_size=scaled_close,
            blur_radius=scaled_blur
        )
        
        # Save as WebP with alpha (Pillow handles WebP alpha better than OpenCV)
        # Convert BGRA → RGBA for Pillow
        rgba_pil = cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA)
        img = Image.fromarray(rgba_pil)
        
        out_path = output_dir / f"frame_{output_idx:03d}.webp"
        img.save(str(out_path), 'WEBP', quality=quality, method=6)
        
        success_count += 1
        if output_idx % 10 == 0:
            size_kb = out_path.stat().st_size / 1024
            alpha = rgba[:, :, 3]
            coverage = (alpha > 128).sum() / alpha.size * 100
            print(f"  Frame {output_idx:03d}/{target_frames-1} | source:{frame_idx:03d} | {size_kb:.0f}KB | car:{coverage:.0f}%")
    
    cap.release()
    
    # Report
    total_size = sum(f.stat().st_size for f in output_dir.glob("*.webp"))
    print()
    print(f"✓ Done! {success_count}/{target_frames} frames extracted")
    print(f"✓ Total size: {total_size/1024/1024:.1f} MB")
    print(f"✓ Output: {output_dir}/")
    print()
    print("Next step: add to CarViewer360 in the page")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--video", required=True, help="Path to input video")
    parser.add_argument("--id", required=True, dest="vehicle_id", help="Vehicle ID (e.g. lamborghini-revuelto)")
    parser.add_argument("--frames", type=int, default=72, help="Number of output frames (min 72)")
    parser.add_argument("--scale", type=float, default=0.5, help="Output scale factor (0.5 = half size)")
    parser.add_argument("--quality", type=int, default=85, help="WebP quality 0-100")
    parser.add_argument("--threshold", type=int, default=15, help="Background luminance threshold (0-255)")
    parser.add_argument("--close-size", type=int, default=35, help="Morphological closing kernel size")
    parser.add_argument("--blur", type=int, default=5, help="Alpha edge blur radius")
    
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
```

### TROUBLESHOOTING BG REMOVAL

**Problem: Dark car parts (tires, black panels) are transparent**
→ Increase `--close-size` from 35 to 50 or 65
→ Slightly lower `--threshold` from 15 to 10

**Problem: Background leaking into image (gray haze around car)**  
→ Lower `--threshold` from 15 to 8 or 12
→ The background is slightly brighter than expected

**Problem: Floor reflection showing (horizontal bright band at bottom)**  
→ After mask generation, add: `car_mask[int(h*0.82):, :] = 0`
→ This crops the floor reflection

**Problem: Car silhouette has jagged edges**  
→ Increase `--blur` from 5 to 8 or 10

**Problem: Car is split into multiple disconnected parts**  
→ Increase `--close-size` to 60+
→ The car body has a very dark section in the middle

---

## STEP 3 — THE REACT COMPONENT

Create `src/components/ui/CarViewer360.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CarViewer360Props {
  vehicleId: string;      // e.g. "lamborghini-revuelto"
  frameCount?: number;    // default 72
  autoRotate?: boolean;   // default true
  autoRotateSpeed?: number; // ms per frame, default 40 (= ~25fps playback)
  autoRotateDirection?: "left" | "right"; // default "right"
  className?: string;
}

export default function CarViewer360({
  vehicleId,
  frameCount = 72,
  autoRotate = true,
  autoRotateSpeed = 40,
  autoRotateDirection = "right",
  className = "",
}: CarViewer360Props) {
  // ─── State ───────────────────────────────────────────────────────────────
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);

  // ─── Refs ────────────────────────────────────────────────────────────────
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<{ x: number; frame: number } | null>(null);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Generate frame URLs ──────────────────────────────────────────────────
  const getFrameUrl = useCallback(
    (index: number) =>
      `/vehicles/${vehicleId}/frame_${String(index).padStart(3, "0")}.webp`,
    [vehicleId]
  );

  // ─── Preload all frames ──────────────────────────────────────────────────
  // Strategy: load all 72 frames into memory on mount for instant response
  useEffect(() => {
    let loadedCount = 0;
    imagesRef.current = [];

    const loadFrame = (index: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          imagesRef.current[index] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / frameCount) * 100));
          if (loadedCount === frameCount) {
            setIsLoaded(true);
            drawFrame(0); // Draw first frame immediately
          }
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          resolve(); // Skip missing frames gracefully
        };
        img.src = getFrameUrl(index);
      });

    // Load first frame immediately for fast initial paint
    loadFrame(0).then(() => {
      // Then load rest in batches of 8 for parallel performance
      const remaining = Array.from({ length: frameCount - 1 }, (_, i) => i + 1);
      const batchSize = 8;
      const loadBatch = (startIdx: number) => {
        if (startIdx >= remaining.length) return;
        const batch = remaining.slice(startIdx, startIdx + batchSize);
        Promise.all(batch.map(loadFrame)).then(() => {
          loadBatch(startIdx + batchSize);
        });
      };
      loadBatch(0);
    });
  }, [vehicleId, frameCount, getFrameUrl]);

  // ─── Draw frame to canvas ────────────────────────────────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIndex];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas size to container
    const container = containerRef.current;
    if (container) {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }

    // Clear with full transparency (car on transparent bg)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center & fit car in canvas with padding
    const padding = 0.08; // 8% padding on each side
    const maxW = canvas.width * (1 - padding * 2);
    const maxH = canvas.height * (1 - padding * 2);
    const scale = Math.min(maxW / img.width, maxH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = (canvas.width - drawW) / 2;
    const drawY = (canvas.height - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Re-draw when frame changes
  useEffect(() => {
    drawFrame(currentFrame);
  }, [currentFrame, drawFrame, isLoaded]);

  // ─── Auto-rotation ────────────────────────────────────────────────────────
  // Auto-rotates smoothly when user isn't dragging
  useEffect(() => {
    if (!isLoaded || !isAutoRotating || isDragging) {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
      return;
    }

    autoRotateRef.current = setInterval(() => {
      setCurrentFrame((prev) => {
        const next =
          autoRotateDirection === "right"
            ? (prev + 1) % frameCount
            : (prev - 1 + frameCount) % frameCount;
        return next;
      });
    }, autoRotateSpeed);

    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [isLoaded, isAutoRotating, isDragging, frameCount, autoRotateSpeed, autoRotateDirection]);

  // ─── Drag interaction ────────────────────────────────────────────────────
  // Converts horizontal drag delta → frame index change
  // sensitivity: how many pixels of drag = one full rotation
  const DRAG_SENSITIVITY = 3; // pixels per frame (lower = more sensitive)

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setIsAutoRotating(false); // Stop auto-rotate while dragging
    dragStartRef.current = { x: clientX, frame: currentFrame };
  }, [currentFrame]);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !dragStartRef.current) return;

    const delta = clientX - dragStartRef.current.x;
    const frameDelta = Math.round(delta / DRAG_SENSITIVITY);
    const newFrame =
      (dragStartRef.current.frame + frameDelta + frameCount * 10) % frameCount;

    setCurrentFrame(newFrame);
  }, [isDragging, frameCount]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
    // Resume auto-rotate after 2s of inactivity
    setTimeout(() => setIsAutoRotating(true), 2000);
  }, []);

  // ─── Mouse events ─────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleDragMove, handleDragEnd]);

  // ─── Touch events (mobile) ───────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  }, [handleDragStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scroll
    handleDragMove(e.touches[0].clientX);
  }, [handleDragMove]);

  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  // ─── Resize observer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => drawFrame(currentFrame));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [currentFrame, drawFrame]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${className}`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-48 h-px bg-[rgba(201,168,76,0.2)] relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#C9A84C] transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-[#9A9080] text-[10px] tracking-[3px] mt-3 uppercase">
            Chargement {loadProgress}%
          </p>
        </div>
      )}

      {/* Canvas — car is drawn here with transparent background */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Drag hint — fades out after first drag */}
      {isLoaded && !isDragging && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
          <svg className="w-4 h-4 text-[#9A9080]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span className="text-[9px] tracking-[2px] text-[#9A9080] uppercase">
            Faire glisser pour pivoter
          </span>
          <svg className="w-4 h-4 text-[#9A9080]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </div>
  );
}
```

---

## STEP 4 — INTEGRATE INTO VEHICLE PAGE

In `src/app/vehicle/[slug]/page.tsx`, replace the static showroom image section with:

```tsx
import CarViewer360 from "@/components/ui/CarViewer360";
import { existsSync } from "fs";
import path from "path";

// In the component, detect if 360 frames exist
// (Server component check — runs at build time / SSR)
const has360 = existsSync(
  path.join(process.cwd(), "public", "vehicles", car.id, "frame_000.webp")
);
```

Then in the JSX, replace the hero image:

```tsx
{/* Vehicle hero — 360 viewer OR fallback static image */}
{has360 ? (
  <div className="relative h-screen">
    {/* Showroom background (blurred, behind transparent car) */}
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/showroom-bg.png"
        alt=""
        fill
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
    
    {/* 360 viewer — car with transparent bg over showroom */}
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="w-full h-full max-w-5xl mx-auto">
        <CarViewer360
          vehicleId={car.id}
          frameCount={72}
          autoRotate={true}
          autoRotateSpeed={45}
          autoRotateDirection="right"
        />
      </div>
    </div>

    {/* Overlay UI: brand, model name, specs — on top of viewer */}
    <div className="absolute top-32 left-0 right-0 z-20 text-center pointer-events-none">
      <p className="text-[11px] tracking-[5px] text-[#C9A84C] font-semibold uppercase mb-3">
        {car.brand}
      </p>
      <h1 className="font-serif text-[clamp(72px,10vw,130px)] font-light tracking-[8px] uppercase leading-none text-[#F5F0E8]">
        {car.model}
      </h1>
    </div>

    {/* Stats and buttons remain as before */}
  </div>
) : (
  /* Fallback: existing static showroom image */
  <div className="relative h-screen">
    <Image src={car.showroomImage} alt={...} fill ... />
  </div>
)}
```

---

## STEP 5 — UPDATE `data.ts`

Add `has360` field to the Car interface:

```typescript
export interface Car {
  // ... existing fields ...
  has360?: boolean; // set to true after frames are generated
}
```

---

## STEP 6 — VERIFY OUTPUT QUALITY

After running the extraction script, visually check 4 frames:

```bash
# Quick check: open these 4 frames in browser or image viewer
public/vehicles/{id}/frame_000.webp   # front view
public/vehicles/{id}/frame_018.webp   # 90° right
public/vehicles/{id}/frame_036.webp   # rear view  
public/vehicles/{id}/frame_054.webp   # 90° left
```

**Quality checklist:**
- [ ] Background is transparent (checkerboard pattern in image viewer)
- [ ] Car edges are clean, not jagged
- [ ] Tires are fully visible (not transparent)
- [ ] No gray haze around car silhouette
- [ ] Frame 000 and frame 071 look similar (good loop)
- [ ] File size: each frame 50–200 KB (if >300KB, lower `--quality`)

**If tires are missing (transparent):**
→ Re-run with `--close-size 55 --threshold 12`

**If background haze appears:**
→ Re-run with `--threshold 10`

---

## STEP 7 — PERFORMANCE NOTES

### Preloading strategy
- All 72 frames preloaded in memory on mount
- First frame loads immediately, rest in batches of 8
- Total RAM: ~72 × (880×588×4 bytes) ≈ 145 MB — acceptable for desktop

### For mobile optimization (optional)
```tsx
// Detect mobile, use 36 frames instead of 72
const isMobile = window.innerWidth < 768;
const frames = isMobile ? 36 : 72;
```

### If 72 frames is too heavy
→ Generate 36 frames with `--frames 36`
→ Effect is still very smooth (10° per frame)

---

## COMPLETE WORKFLOW SUMMARY

```bash
# 1. Install Python deps (one time)
pip install opencv-python-headless Pillow numpy

# 2. Run extraction (replace paths and ID)
python scripts/extract_360_frames.py \
  --video public/videos/lamborghini-revuelto.mp4 \
  --id lamborghini-revuelto \
  --frames 72 \
  --scale 0.5 \
  --quality 85

# 3. Verify 4 key frames look correct
# (check frame_000, frame_018, frame_036, frame_054)

# 4. Start dev server to test in browser
npm run dev

# 5. Navigate to /vehicle/lamborghini-revuelto
# → Should see 360 viewer with auto-rotation + drag
```

---

## FILE SIZE REFERENCE

| Frames | Scale | Quality | Approx Total |
|--------|-------|---------|--------------|
| 36     | 0.5   | 85      | ~1.2 MB      |
| 72     | 0.5   | 85      | ~2.5 MB      |
| 72     | 0.5   | 90      | ~3.8 MB      |
| 90     | 0.5   | 85      | ~3.0 MB      |
| 72     | 0.65  | 85      | ~4.0 MB      |

**Target: under 5 MB total per vehicle for good UX.**

---

## NOTES FOR CLAUDE CODE

- Always run the analysis script FIRST to understand the video before choosing params
- The `threshold` param is the most important — wrong threshold = ugly mask
- Always verify 4 keyframes visually before integrating
- The `CarViewer360` component is self-contained — no external libraries needed
- Canvas approach is used (not `<img>` tags) for instant frame switching without flicker
- Auto-rotate resumes 2 seconds after user stops dragging
- Touch events are handled for mobile — `e.preventDefault()` stops page scroll during drag
