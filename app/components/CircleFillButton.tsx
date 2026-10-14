'use client';

import React, { useRef, useState } from "react";
import { motion, animate, useMotionValue, type Transition } from "framer-motion";

const BASE = 100;

export interface CircleFillButtonProps {
  text?: string;
  hoverText?: string;
  link?: string;
  newTab?: boolean;
  textColor?: string;
  textHoverColor?: string;
  background?: string;
  fillColor?: string;
  fillOrigin?: "cursor" | "center";
  iconStyle?: "arrow" | "longArrow" | "chevron" | "doubleChevron" | "triangle" | "arrowCircle";
  iconSize?: number;
  iconStroke?: number;
  iconColor?: string;
  iconHoverColor?: string;
  restAngle?: number;
  padding?: string;
  gap?: number;
  radius?: string;
  className?: string;
  style?: React.CSSProperties;
  transition?: Transition;
  onClick?: (e: React.MouseEvent) => void;
}

function ArrowIcon({
  style = "arrow",
  size = 20,
  stroke = 1.8,
}: {
  style?: string;
  size?: number;
  stroke?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { display: "block" },
  };

  switch (style) {
    case "longArrow":
      return (
        <svg {...common}>
          <path d="M2 12h20M16 6l6 6-6 6" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      );
    case "doubleChevron":
      return (
        <svg {...common}>
          <path d="M5 5l7 7-7 7M12 5l7 7-7 7" />
        </svg>
      );
    case "triangle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
          <path d="M7 4.5l13 7.5-13 7.5z" />
        </svg>
      );
    case "arrowCircle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M7 12h10M13 8l4 4-4 4" />
        </svg>
      );
    case "arrow":
    default:
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
  }
}

export default function CircleFillButton({
  text = "Resume",
  hoverText = "Hire me",
  link = "https://drive.google.com/file/d/1FZaPrWzZruhE2X1j9ScbOjrvs_5yvFEn/view?usp=sharing",
  newTab = true,
  textColor = "#111111",
  textHoverColor = "#FFFFFF",
  background = "linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.90) 100%)",
  fillColor = "#111111",
  fillOrigin = "cursor",
  iconStyle = "arrow",
  iconSize = 18,
  iconStroke = 1.9,
  iconColor = "#111111",
  iconHoverColor = "#FFFFFF",
  restAngle = -45,
  padding = "10px 22px",
  gap = 10,
  radius = "100px",
  className = "",
  style,
  transition = { type: "tween", duration: 0.85, ease: [0.65, 0, 0.35, 1] },
  onClick,
}: CircleFillButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  // Circle position and scale for GPU transform acceleration
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(0);

  const enter = (e?: React.PointerEvent | React.FocusEvent) => {
    const el = ref.current;
    if (!el) return;
    setHovered(true);
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const isHidden = scale.get() < 0.02;
    let cx = w / 2;
    let cy = h / 2;

    if (isHidden) {
      if (fillOrigin === "cursor" && e && "clientX" in e) {
        cx = Math.min(Math.max(e.clientX - rect.left, 0), w);
        cy = Math.min(Math.max(e.clientY - rect.top, 0), h);
      }
      x.set(cx - BASE / 2);
      y.set(cy - BASE / 2);
      scale.set(0);
    } else {
      cx = x.get() + BASE / 2;
      cy = y.get() + BASE / 2;
    }

    const radiusNeeded = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(w - cx, cy),
      Math.hypot(cx, h - cy),
      Math.hypot(w - cx, h - cy)
    );
    const target = (radiusNeeded * 2 + 2) / BASE;
    animate(scale, target, transition);
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    setHovered(false);
    const rect = el.getBoundingClientRect();
    animate(x, rect.width / 2 - BASE / 2, transition);
    animate(y, rect.height / 2 - BASE / 2, transition);
    animate(scale, 0, transition);
  };

  const linkProps = link
    ? {
        href: link,
        target: newTab ? "_blank" : undefined,
        rel: newTab ? "noopener noreferrer" : undefined,
      }
    : {};

  return (
    <motion.a
      ref={ref}
      {...linkProps}
      onClick={onClick}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className={`group/cfill relative inline-flex items-center justify-between overflow-hidden cursor-pointer select-none border border-white hover:border-black transition-colors duration-300 backdrop-blur-[10px] ${className}`}
      style={{
        ...style,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap,
        boxSizing: "border-box",
        padding,
        background,
        borderRadius: radius,
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
        isolation: "isolate",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Expanding Ripple Circle on GPU */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: BASE,
          height: BASE,
          borderRadius: "50%",
          background: fillColor,
          x,
          y,
          scale,
          pointerEvents: "none",
          willChange: "transform",
          zIndex: 0,
        }}
      />

      {/* Button Text with Smooth Hover Swap */}
      {hoverText && hoverText !== text ? (
        <span
          className="relative inline-grid place-items-center"
          style={{ position: "relative", zIndex: 1, margin: 0 }}
        >
          {/* Default Text (e.g. Resume) */}
          <motion.span
            initial={false}
            animate={{
              opacity: hovered ? 0 : 1,
              y: hovered ? -8 : 0,
              color: textColor,
            }}
            transition={transition}
            className="col-start-1 row-start-1 font-bold text-sm md:text-base tracking-wider uppercase whitespace-nowrap"
            aria-hidden={hovered}
          >
            {text}
          </motion.span>

          {/* Hover Text (e.g. Hire me) */}
          <motion.span
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
              y: hovered ? 0 : 8,
              color: textHoverColor,
            }}
            transition={transition}
            className="col-start-1 row-start-1 font-bold text-sm md:text-base tracking-wider uppercase whitespace-nowrap"
            aria-hidden={!hovered}
          >
            {hoverText}
          </motion.span>
        </span>
      ) : (
        <motion.span
          initial={false}
          animate={{ color: hovered ? textHoverColor : textColor }}
          transition={transition}
          className="font-bold text-sm md:text-base tracking-wider uppercase whitespace-nowrap"
          style={{
            position: "relative",
            zIndex: 1,
            margin: 0,
          }}
        >
          {text}
        </motion.span>
      )}

      {/* Button Icon */}
      <motion.span
        initial={false}
        animate={{
          rotate: hovered ? 0 : restAngle,
          color: hovered ? iconHoverColor : iconColor,
        }}
        transition={transition}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: iconSize,
          height: iconSize,
        }}
      >
        <ArrowIcon style={iconStyle} size={iconSize} stroke={iconStroke} />
      </motion.span>
    </motion.a>
  );
}
