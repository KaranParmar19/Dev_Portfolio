"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

const defaultPalette = ["#000000"];
const defaultStyle: CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontSize: 220,
  fontWeight: 800,
  letterSpacing: "-0.06em",
  lineHeight: "0.92em",
  textAlign: "left",
};

interface AnimatedColourTypographyProps {
  text: string;
  palette?: string[];
  style?: CSSProperties;
}

interface LetterState {
  stroke: number;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  radius: number;
  duration: number;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createLetterState(): LetterState {
  return {
    stroke: randomBetween(0, 10),
    x: 0,
    y: randomBetween(-12, 12),
    rotation: randomBetween(-5, 5),
    scaleX: randomBetween(0.88, 1.12),
    scaleY: randomBetween(0.88, 1.12),
    radius: randomBetween(0, 22),
    duration: randomBetween(0.132, 0.324),
  };
}

function createStaticState(): LetterState {
  return {
    stroke: 5,
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    radius: 0,
    duration: 0,
  };
}

function getRandomIndices(length: number, count: number) {
  const indices = Array.from({ length }, (_, index) => index);
  for (let index = indices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
  }
  return indices.slice(0, count);
}

export default function AnimatedColourTypography({
  text,
  palette = defaultPalette,
  style = defaultStyle,
}: AnimatedColourTypographyProps) {
  const letters = useMemo(() => Array.from(text.toUpperCase()), [text]);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [letterStates, setLetterStates] = useState(() => letters.map(createStaticState));
  const activeColor = palette[activeColorIndex] ?? palette[0] ?? "#000000";
  const textAlign = style.textAlign ?? "left";

  useEffect(() => {
    if (palette.length <= 1) return;
    const intervalId = window.setInterval(() => {
      setActiveColorIndex((currentIndex) => {
        const otherColors = palette.filter((_, index) => index !== currentIndex);
        const nextColor = otherColors[Math.floor(Math.random() * otherColors.length)];
        return palette.indexOf(nextColor);
      });
    }, 800);

    return () => window.clearInterval(intervalId);
  }, [palette]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setLetterStates((previousStates) => {
        const nextStates = letters.map((_, index) => previousStates[index] ?? createStaticState());
        const activeIndices = getRandomIndices(letters.length, Math.min(2, letters.length));
        activeIndices.forEach((index) => {
          nextStates[index] = createLetterState();
        });
        return nextStates;
      });
    }, 240);

    return () => window.clearInterval(intervalId);
  }, [letters]);

  return (
    <div
      role="img"
      aria-label={text}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start",
        overflow: "visible",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          whiteSpace: "pre-wrap",
          ...style,
        }}
      >
        {letters.map((character, index) => {
          if (character === " ") return <span key={`space-${index}`}> </span>;
          if (character === "\n") return <br key={`break-${index}`} />;

          const state = letterStates[index] ?? createStaticState();
          const letterStyle: CSSProperties = {
            display: "inline-block",
            transform: `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg) scale(${state.scaleX}, ${state.scaleY})`,
            borderRadius: `${state.radius}px`,
            transitionProperty: "transform, border-radius, -webkit-text-stroke-width",
            transitionDuration: `${state.duration}s`,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: `${index * 0.03}s`,
            WebkitTextStrokeWidth: `${Math.min(Math.max(state.stroke, 0), 200)}px`,
            WebkitTextStrokeColor: activeColor,
            WebkitTextFillColor: activeColor,
            color: activeColor,
            transformOrigin: "50% 70%",
            willChange: "transform, border-radius, -webkit-text-stroke-width",
          };

          return (
            <span key={`${character}-${index}`} aria-hidden="true" style={letterStyle}>
              {character}
            </span>
          );
        })}
      </div>
    </div>
  );
}
