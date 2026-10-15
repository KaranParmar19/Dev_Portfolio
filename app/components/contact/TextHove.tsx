"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";


interface TextProps {
  text: string;
}

const underlinePaths = [
  "M5 29 C34 24 63 17 94 18 C125 19 149 26 180 23 C222 18 261 11 305 14",
  "M5 18 C41 21 62 27 101 21 C130 17 163 11 194 17 C230 24 269 22 305 15",
  "M5 25 C37 20 67 18 99 20 C131 22 161 17 193 14 C233 10 268 15 305 11",
  "M0 27 C48 16 100 16 151 23 C204 30 258 13 310 17",
  "M5 21 C66 17 126 14 187 13 C226 12 266 13 305 14",
  "M5 11 C44 15 65 27 106 25 C145 24 170 9 208 9 C247 9 276 17 305 22",
];

const BASE_WIDTH = 310;
const BASE_HEIGHT = 40;
const underlineStyles: Record<string, { color: string; strokeWidth: number; gap: number; variantOffset: number }> = {
  leetcode: { color: "#e55050", strokeWidth: 6, gap: 0, variantOffset: 0 },
  github: { color: "#24292e", strokeWidth: 4, gap: 1, variantOffset: 1 },
  linkedin: { color: "#0a66c2", strokeWidth: 6, gap: 0, variantOffset: 2 },
  "kp5336464@gmail.com": { color: "#e67e22", strokeWidth: 5, gap: 2, variantOffset: 3 },
};

export default function TextBorderAnimation({ text = "Programming" }: TextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [activePathIndex, setActivePathIndex] = useState<number | null>(null);
  const [hoverCount, setHoverCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const underlineStyle = underlineStyles[text.toLowerCase()] ?? underlineStyles.leetcode;

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const updateWidth = () => setUnderlineWidth(textElement.getBoundingClientRect().width);
    const observer = new ResizeObserver(updateWidth);
    observer.observe(textElement);
    updateWidth();

    return () => observer.disconnect();
  }, [text]);

  const handleMouseEnter = () => {
    setActivePathIndex((underlineStyle.variantOffset + hoverCount) % underlinePaths.length);
    setHoverCount((count) => count + 1);
    setIsHovered(true);
  };

  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-flex w-fit cursor-pointer flex-col items-start overflow-visible group"
    >
      <span ref={textRef} className='font-semibold text-black wrap-break-word'>
        {text}
      </span>

      <div
        aria-hidden="true"
        style={{
          color: underlineStyle.color,
          width: underlineWidth ? `${underlineWidth}px` : "100%",
          height: underlineWidth ? `${underlineWidth * BASE_HEIGHT / BASE_WIDTH}px` : "0.5em",
          marginTop: underlineStyle.gap,
          position: "relative",
          visibility: underlineWidth ? "visible" : "hidden",
          overflow: "visible",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox={`0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`}
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          <path
            ref={pathRef}
            d={underlinePaths[activePathIndex ?? underlineStyle.variantOffset]}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={underlineStyle.strokeWidth}
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="1"
            strokeDashoffset={isHovered ? 0 : 1}
            style={{
              transition: prefersReducedMotion
                ? "none"
                : `stroke-dashoffset ${isHovered ? 600 : 450}ms cubic-bezier(0.65, 0, 0.35, 1)`,
            }}
          />
        </svg>
      </div>
    </div>
  );
}