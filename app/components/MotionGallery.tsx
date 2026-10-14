"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, useMotionValue, useSpring, useInView, animate, useTransform } from "framer-motion";

export interface GalleryImage {
  src: string;
  alt?: string;
  srcSet?: string;
}

export interface MotionGalleryProps {
  images?: (string | GalleryImage)[];
  orientation?: "horizontal" | "vertical";
  gap?: number;
  padding?: number;
  itemWidth?: number; // scale factor percentage (e.g. 100)
  borderRadius?: number;
  backgroundColor?: string;
  showIndicators?: boolean;
  indicatorColor?: string;
  indicatorActiveColor?: string;
  entranceDuration?: number;
  entranceDelay?: number;
  autoCentered?: boolean;
  scrollSpeed?: number;
  scrollSmoothness?: number;
  soundEffectType?: "mechanical" | "bloop" | "whoosh" | "chime" | "tap" | "softClick";
  soundEnabled?: boolean;
  soundVolume?: number;
  showScrollHint?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SOUND_THROTTLE_MS = 80;
const SNAP_TIMEOUT_MS = 150;
const ITEM_ASPECT_RATIO = 16 / 9;
const ITEM_HEIGHT_PERCENT = 0.95;
const ITEM_WIDTH_PERCENT = 0.95;

export default function MotionGallery({
  images: rawImages = [],
  orientation = "horizontal",
  gap = 20,
  padding = 0,
  itemWidth = 100,
  borderRadius = 14,
  backgroundColor = "transparent",
  showIndicators = true,
  indicatorColor = "rgba(0, 0, 0, 0.25)",
  indicatorActiveColor = "#000000",
  entranceDuration = 0.6,
  entranceDelay = 0.1,
  autoCentered = true,
  scrollSpeed = 0.5,
  scrollSmoothness = 0.5,
  soundEffectType = "tap",
  soundEnabled = true,
  soundVolume = 0.5,
  showScrollHint = true,
  className = "",
  style = {},
}: MotionGalleryProps) {
  // Normalize images to object format
  const images = useMemo<GalleryImage[]>(() => {
    return rawImages
      .map((img) => (typeof img === "string" ? { src: img, alt: "" } : img))
      .filter((img): img is GalleryImage => Boolean(img?.src));
  }, [rawImages]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Touch and Drag refs
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartOffsetRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  const [containerSize, setContainerSize] = useState({ width: 800, height: 320 });
  const [hasEntered, setHasEntered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastSoundTimeRef = useRef<number>(0);
  const scrollVelocityRef = useRef<number>(0);

  const isHorizontal = orientation === "horizontal";

  // Base motion offset
  const baseOffset = useMotionValue(0);

  // Spring physics matching Framer config
  const springConfig = useMemo(
    () => ({
      stiffness: 500 - scrollSmoothness * 450,
      damping: 15 + scrollSmoothness * 25,
      mass: 0.6 + scrollSmoothness * 0.4,
    }),
    [scrollSmoothness]
  );
  const springOffset = useSpring(baseOffset, springConfig);

  // Measure container dimensions accurately
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width: Math.max(rect.width, 20),
        height: Math.max(rect.height, 20),
      });
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      resizeObserver?.disconnect();
    };
  }, []);

  // Entrance trigger
  useEffect(() => {
    if (isInView && !hasEntered) {
      setHasEntered(true);
    }
  }, [isInView, hasEntered]);

  // Reset scroll position when images change
  useEffect(() => {
    if (images.length > 0) {
      baseOffset.set(0);
      setCurrentIndex(0);
    }
  }, [images.length, baseOffset]);

  // Calculate base dimensions
  const baseItemHeight = containerSize.height * ITEM_HEIGHT_PERCENT;
  const baseItemWidth = isHorizontal
    ? baseItemHeight * ITEM_ASPECT_RATIO
    : containerSize.width * ITEM_WIDTH_PERCENT;

  // Apply itemWidth as a scale factor
  const scaleFactor = itemWidth / 100;
  const finalItemWidth = isHorizontal ? baseItemWidth * scaleFactor : baseItemWidth;
  const itemHeight = isHorizontal ? baseItemHeight : baseItemHeight * scaleFactor;
  const itemSize = Math.max(isHorizontal ? finalItemWidth + gap : itemHeight + gap, 1);

  // Sound synthesis via Web Audio API (identical to Framer implementation)
  const playItemScrollSound = useCallback(
    (velocity = 1) => {
      if (!soundEnabled || typeof window === "undefined") return;
      const now = Date.now();
      if (now - lastSoundTimeRef.current < SOUND_THROTTLE_MS) return;
      lastSoundTimeRef.current = now;

      const velocityFactor = Math.min(1, Math.max(0.1, velocity * 2));
      const finalVolume = Math.min(1, soundVolume * velocityFactor);

      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioContextRef.current || audioContextRef.current.state === "closed") {
          audioContextRef.current = new AudioCtx();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        switch (soundEffectType) {
          case "mechanical":
            osc.type = "square";
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
            filter.type = "highpass";
            filter.frequency.setValueAtTime(600, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3 * finalVolume, ctx.currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.04);
            break;
          case "bloop":
            osc.type = "triangle";
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(600, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.25 * finalVolume, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.13);
            break;
          case "whoosh": {
            const bufferSize = Math.floor(ctx.sampleRate * 0.1);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.connect(filter);
            filter.connect(gain);
            filter.type = "bandpass";
            filter.frequency.setValueAtTime(200, ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
            filter.Q.setValueAtTime(1, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2 * finalVolume, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            noise.start(ctx.currentTime);
            noise.stop(ctx.currentTime + 0.12);
            break;
          }
          case "chime":
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(2000, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3 * finalVolume, ctx.currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
            break;
          case "tap":
            osc.type = "sine";
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(1500, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.4 * finalVolume, ctx.currentTime + 0.003);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
            break;
          case "softClick":
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.015);
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(2000, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.15 * finalVolume, ctx.currentTime + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.035);
            break;
        }
      } catch {
        // Silent fail for audio security blocks
      }
    },
    [soundEffectType, soundEnabled, soundVolume]
  );

  // Track position and trigger sounds on half-step boundaries
  const hasInitializedRef = useRef(false);
  const prevHalfPosRef = useRef(0);

  useEffect(() => {
    if (!itemSize) return;
    unsubscribeRef.current?.();
    unsubscribeRef.current = springOffset.on("change", (v) => {
      if (images.length === 0) return;
      const pos = -v / itemSize;
      const halfPos = Math.floor(pos * 2);
      if (hasInitializedRef.current && halfPos !== prevHalfPosRef.current) {
        playItemScrollSound(scrollVelocityRef.current);
      }
      prevHalfPosRef.current = halfPos;
      hasInitializedRef.current = true;

      const idx = Math.round(pos);
      const newIndex = ((idx % images.length) + images.length) % images.length;
      setCurrentIndex(newIndex);
    });

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [springOffset, images.length, itemSize, playItemScrollSound]);

  // Cleanup audio & timer on unmount
  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const snapToNearest = useCallback(() => {
    if (itemSize < 2 || images.length <= 1) return;
    const target = -Math.round(-baseOffset.get() / itemSize) * itemSize;
    animate(baseOffset, target, { type: "spring", ...springConfig });
  }, [baseOffset, itemSize, images.length, springConfig]);

  // Handle Wheel Event:
  // If the user scrolls horizontally (deltaX) or holds Shift, it controls the gallery.
  // This ensures normal vertical page scrolling is NOT blocked or disturbed!
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (images.length <= 1 || itemSize < 2) return;

    const hasHorizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const isShiftScroll = e.shiftKey;

    if (hasHorizontalDelta || isShiftScroll) {
      e.preventDefault();
      e.stopPropagation();

      const delta = hasHorizontalDelta ? e.deltaX : e.deltaY;
      const now = Date.now();
      const timeDelta = Math.max(1, now - lastSoundTimeRef.current);
      const velocity = Math.abs(delta) / timeDelta;
      scrollVelocityRef.current = velocity;

      baseOffset.set(baseOffset.get() - delta * scrollSpeed);

      if (!autoCentered) return;
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(snapToNearest, SNAP_TIMEOUT_MS);
    }
  };

  // Pointer / Touch / Mouse Drag handlers for frictionless intuitive swiping
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (images.length <= 1 || itemSize < 2) return;
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === "button") return; // don't intercept indicator clicks

    // Resume AudioContext on user interaction
    if (soundEnabled && audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartOffsetRef.current = baseOffset.get();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !dragStartRef.current || images.length <= 1 || itemSize < 2) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    const delta = isHorizontal ? deltaX : deltaY;

    const now = Date.now();
    const timeDelta = Math.max(1, now - lastSoundTimeRef.current);
    const velocity = Math.abs(delta) / timeDelta;
    scrollVelocityRef.current = velocity;

    baseOffset.set(dragStartOffsetRef.current + delta);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    dragStartRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (autoCentered && images.length > 1 && itemSize >= 2) {
      snapToNearest();
    }
  };

  const goToIndex = (index: number) => {
    if (images.length <= 1 || itemSize < 2) return;
    const current = Math.round(-springOffset.get() / itemSize);
    const wrapped = ((current % images.length) + images.length) % images.length;
    let diff = index - wrapped;
    if (diff > images.length / 2) diff -= images.length;
    if (diff < -images.length / 2) diff += images.length;
    animate(baseOffset, springOffset.get() - diff * itemSize, {
      type: "spring",
      ...springConfig,
    });
  };

  // If no images
  if (!images.length) {
    return (
      <div
        ref={containerRef}
        style={{
          ...style,
          backgroundColor,
          borderRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
        }}
        className={`w-full h-full ${className}`}
      >
        No preview images
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    ...style,
    position: "relative",
    backgroundColor: "transparent",
    overflow: "hidden",
    touchAction: "pan-y",
    padding,
    userSelect: "none",
  };

  return (
    <div className={`flex flex-col w-full h-full select-none bg-transparent ${className}`}>
      {/* Motion Gallery Viewport */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={hasEntered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{
          duration: entranceDuration,
          delay: entranceDelay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={containerStyle}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Gallery Items track */}
        <div className="w-full h-full relative overflow-hidden pointer-events-none">
          {images.map((img, i) => (
            <GalleryItem
              key={`${i}-${img.src}`}
              itemIndex={i}
              image={img}
              itemWidth={finalItemWidth}
              itemHeight={itemHeight}
              itemSize={itemSize}
              borderRadius={borderRadius}
              isHorizontal={isHorizontal}
              containerSize={containerSize}
              springOffset={springOffset}
              hasEntered={hasEntered}
              entranceDelay={entranceDelay}
              totalImages={images.length}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom Controls Row: Scroll Hint & Indicators (Framed directly on canvas like Image 2) */}
      <div className="flex items-center justify-between w-full pt-3 px-4 md:px-10 xl:px-16 shrink-0 pointer-events-auto">
        {/* Scroll Hint */}
        {showScrollHint && images.length > 1 ? (
          <span className="text-[12px] font-mono tracking-wide text-black/60 font-medium">
            ( Scroll {isHorizontal ? "horizontally" : "vertically"} )
          </span>
        ) : (
          <div />
        )}

        {/* Indicators */}
        {showIndicators && images.length > 1 && (
          <div className="flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToIndex(i)}
                style={{
                  width: i === currentIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === currentIndex ? indicatorActiveColor : indicatorColor,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                  padding: 0,
                  outline: "none",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {images.length > 1 ? (
          <span className="text-[12px] font-mono tracking-widest text-black/60 font-semibold">
            {currentIndex + 1} / {images.length}
          </span>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

/**
 * GalleryItem Component
 * Renders individual carousel items with infinite scroll positioning
 */
interface GalleryItemProps {
  itemIndex: number;
  image: GalleryImage;
  itemWidth: number;
  itemHeight: number;
  itemSize: number;
  borderRadius: number;
  isHorizontal: boolean;
  containerSize: { width: number; height: number };
  springOffset: ReturnType<typeof useSpring>;
  hasEntered: boolean;
  entranceDelay: number;
  totalImages: number;
}

function GalleryItem({
  itemIndex,
  image,
  itemWidth,
  itemHeight,
  itemSize,
  borderRadius,
  isHorizontal,
  containerSize,
  springOffset,
  hasEntered,
  entranceDelay,
  totalImages,
}: GalleryItemProps) {
  const getPosition = (offset: number) => {
    const total = totalImages * itemSize;
    if (!total) return 0;
    let pos = itemIndex * itemSize + offset;
    // Wrap within total range using positive modulo
    pos = ((pos % total) + total) % total;
    // Keep items within ±half total for shortest-path positioning
    if (pos > total / 2) pos -= total;
    return pos;
  };

  const x = useTransform(springOffset, (v) =>
    isHorizontal
      ? containerSize.width / 2 - itemWidth / 2 + getPosition(v)
      : containerSize.width / 2 - itemWidth / 2
  );

  const y = useTransform(springOffset, (v) =>
    isHorizontal
      ? containerSize.height / 2 - itemHeight / 2
      : containerSize.height / 2 - itemHeight / 2 + getPosition(v)
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={hasEntered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{
        duration: 0.5,
        delay: entranceDelay + itemIndex * 0.03,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        width: itemWidth,
        height: itemHeight,
        borderRadius,
        overflow: "hidden",
        position: "absolute",
        x,
        y,
        top: 0,
        left: 0,
        willChange: "transform",
        boxShadow: "0 16px 36px -10px rgba(0, 0, 0, 0.35), 0 0 0 2px rgba(0, 0, 0, 0.9)",
      }}
      className="bg-neutral-900 border-none shrink-0"
    >
      <img
        src={image.src}
        alt={image.alt || ""}
        srcSet={image.srcSet}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
        }}
        draggable={false}
      />
    </motion.div>
  );
}
