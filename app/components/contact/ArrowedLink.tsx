'use client';

import React, { useId, useState } from 'react';

const HOVER_PALETTE = [
  '#e26d5c', // Coral / Terracotta (Portfolio accent)
  '#3b82f6', // Electric Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber / Gold
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#6366f1', // Indigo
  '#14b8a6', // Teal
];

interface ArrowedLinkProps {
  label: string;
  url: string;
  openInNewTab?: boolean;
  uppercase?: boolean;
  textColor?: string;
  lineColor?: string;
  className?: string;
  hoverPalette?: string[];
}

export default function ArrowedLink({
  label,
  url,
  openInNewTab = true,
  uppercase = true,
  textColor = '#000000',
  lineColor = 'rgba(0,0,0,0.25)',
  className = '',
  hoverPalette = HOVER_PALETTE,
}: ArrowedLinkProps) {
  const id = useId().replace(/:/g, '');
  const scopeClass = `alh_${id}`;

  const [activeColor, setActiveColor] = useState(hoverPalette[0]);

  const handlePointerEnter = () => {
    setActiveColor((prev) => {
      const candidates = hoverPalette.filter((c) => c !== prev);
      return candidates[Math.floor(Math.random() * candidates.length)] || prev;
    });
  };

  const displayLabel = uppercase ? label.toUpperCase() : label;
  const targetProps = openInNewTab
    ? { target: '_blank' as const, rel: 'noreferrer noopener' }
    : {};

  const css = `
.${scopeClass} {
  --alh-text: ${textColor};
  --alh-line: ${lineColor};
  --s4-line: var(--alh-line);
  --s4-color: var(--alh-text);
}

.${scopeClass} .linkWrap {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.${scopeClass} a {
  font: inherit;
}

.${scopeClass} .alh-link {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.${scopeClass} .alh-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0,0,0,0.16);
  border-radius: 10px;
}

.${scopeClass} .style-4 {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--s4-color);
  position: relative;
  padding: 0;
  --background-size: 100%;
  --background-delay: 0.15s;
  --stroke-dashoffset: 46;
  --stroke-duration: 0.15s;
  --stroke-easing: linear;
  --stroke-delay: 0s;
}

.${scopeClass} .style-4 span {
  background-image: linear-gradient(0deg, var(--s4-line) 0%, var(--s4-line) 100%);
  background-position: 100% 100%;
  background-repeat: no-repeat;
  background-size: var(--background-size, 100%) 1px;
  transition: background-size 0.2s linear var(--background-delay, 0.15s);
  transform: translateZ(0);
}

.${scopeClass} .style-4 svg {
  vertical-align: top;
  display: inline;
  line-height: 1;
  width: 1.3em;
  height: 2em;
  position: relative;
  top: -0.6px;
  left: -0.1em;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1px;
  stroke: var(--s4-line);
  stroke-dasharray: 7.95 30;
  stroke-dashoffset: var(--stroke-dashoffset, 46);
  transition: stroke-dashoffset var(--stroke-duration, 0.15s) var(--stroke-easing, linear) var(--stroke-delay, 0s);
}

.${scopeClass} .style-4:hover {
  --background-size: 0%;
  --background-delay: 0s;
  --stroke-dashoffset: 26;
  --stroke-duration: 0.3s;
  --stroke-easing: cubic-bezier(0.3, 1.5, 0.5, 1);
  --stroke-delay: 0.195s;
  --s4-line: var(--alh-hoverLine);
  color: var(--alh-hoverText);
}
`;

  return (
    <div
      className={`${scopeClass} ${className}`}
      style={
        {
          '--alh-hoverText': activeColor,
          '--alh-hoverLine': activeColor,
        } as React.CSSProperties
      }
      onPointerEnter={handlePointerEnter}
    >
      <style>{css}</style>
      <div className="linkWrap">
        <a
          className="alh-link style-4"
          href={url}
          aria-label={label}
          {...targetProps}
        >
          <span>{displayLabel}</span>
          <svg viewBox="0 0 13 20" aria-hidden="true" focusable={false}>
            <polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" />
          </svg>
        </a>
      </div>
    </div>
  );
}
