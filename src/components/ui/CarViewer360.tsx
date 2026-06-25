"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CarViewer360Props {
  videoSrc: string;
  className?: string;
}

export default function CarViewer360({ videoSrc, className = "" }: CarViewer360Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag sensitivity : pixels needed for one full rotation
  const DRAG_PX_PER_ROTATION = 500;

  const handleDragStart = useCallback((clientX: number) => {
    const video = videoRef.current;
    if (!video || !isReady) return;
    video.pause();
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsDragging(true);
    setHasInteracted(true);
    dragStartRef.current = { x: clientX, time: video.currentTime };
  }, [isReady]);

  const handleDragMove = useCallback((clientX: number) => {
    const video = videoRef.current;
    if (!isDragging || !dragStartRef.current || !video) return;
    const delta = clientX - dragStartRef.current.x;
    const duration = video.duration || 10;
    const timeDelta = (delta / DRAG_PX_PER_ROTATION) * duration;
    let newTime = dragStartRef.current.time - timeDelta;
    newTime = ((newTime % duration) + duration) % duration;
    video.currentTime = newTime;
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
    resumeTimerRef.current = setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 1500);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleDragMove(e.clientX);
    const onUp = () => { if (isDragging) handleDragEnd(); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [handleDragMove, handleDragEnd, isDragging]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  }, [handleDragStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  }, [handleDragMove]);

  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  return (
    <div
      className={`relative w-full h-full select-none ${className}`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-40 h-px bg-[rgba(201,168,76,0.2)] overflow-hidden relative">
            <div className="absolute inset-0 bg-[#C9A84C] animate-pulse" />
          </div>
        </div>
      )}

      {/* La vidéo utilise mix-blend-mode: screen pour rendre le fond noir transparent */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`w-full h-full object-contain transition-opacity duration-700 ${isReady ? "opacity-100" : "opacity-0"}`}
        style={{ mixBlendMode: "screen" }}
        onLoadedData={() => setIsReady(true)}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {isReady && !hasInteracted && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none animate-pulse">
          <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span className="text-[8px] tracking-[2px] text-[#C9A84C] uppercase font-semibold">Faire glisser pour pivoter</span>
          <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </div>
  );
}
