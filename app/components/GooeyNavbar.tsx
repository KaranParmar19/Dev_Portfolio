"use client";

import * as React from "react";
import { motion, useInView, useMotionValue } from "framer-motion";

function toPath(value: string | null | undefined) {
  if (!value) return null;
  let path = value;
  const schemeEnd = path.indexOf("://");
  if (schemeEnd !== -1) {
    const afterHost = path.indexOf("/", schemeEnd + 3);
    path = afterHost === -1 ? "/" : path.slice(afterHost);
  }
  const queryStart = path.search(/[?#]/u);
  if (queryStart !== -1) path = path.slice(0, queryStart);
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1) path = path.replace(/\/+$/u, "");
  return path.toLowerCase() || "/";
}

function toHash(value: string | null | undefined) {
  if (!value) return null;
  const marker = value.indexOf("#");
  if (marker === -1) return null;
  return value.slice(marker + 1).trim() || null;
}

function round(value: number) {
  return (Math.round(value * 100) / 100).toString();
}

function pillPath(rect: { x: number; y: number; width: number; height: number }, radius: number) {
  const r = Math.min(radius, rect.width / 2, rect.height / 2);
  const { x, y, width: w, height: h } = rect;
  return [
    `M${round(x)} ${round(y + r)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + r)} ${round(y)}`,
    `L${round(x + w - r)} ${round(y)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + w)} ${round(y + r)}`,
    `L${round(x + w)} ${round(y + h - r)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + w - r)} ${round(y + h)}`,
    `L${round(x + r)} ${round(y + h)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x)} ${round(y + h - r)}`,
    "Z",
  ].join(" ");
}

function waistPath(
  left: { x: number; y: number; width: number; height: number },
  right: { x: number; y: number; width: number; height: number },
  radius: number,
  neck: number,
  openness: number,
) {
  if (openness <= 0.02) return null;
  const h = left.height;
  const cy = left.y + h / 2;
  const r = Math.min(radius, h / 2, left.width / 2, right.width / 2);
  if (r <= 0) return null;
  const xa = left.x + left.width;
  const xb = right.x;
  const gap = xb - xa;
  if (gap < 0) return null;
  const waistHalf = Math.min((neck / 2) * openness, h / 2 - 0.5);
  const across = gap / 2 + r;
  const drop = waistHalf - h / 2 + r;
  const denom = 2 * (drop - r);
  if (Math.abs(denom) < 1e-4) return null;
  const fillet = (r * r - across * across - drop * drop) / denom;
  if (!(fillet > 0) || r + fillet < across) return null;
  const rise = Math.sqrt(Math.max(0, (r + fillet) * (r + fillet) - across * across));
  const midX = (xa + xb) / 2;
  const cornerX = xa - r;
  const cornerY = left.y + r;
  const vx = midX - cornerX;
  const vy = left.y + r - rise - cornerY;
  const len = Math.hypot(vx, vy) || 1;
  const tax = cornerX + (r * vx) / len;
  const tay = cornerY + (r * vy) / len;
  const tbx = 2 * midX - tax;
  return [
    `M${round(tax)} ${round(tay)}`,
    `A${round(fillet)} ${round(fillet)} 0 0 0 ${round(tbx)} ${round(tay)}`,
    `L${round(tbx)} ${round(2 * cy - tay)}`,
    `A${round(fillet)} ${round(fillet)} 0 0 0 ${round(tax)} ${round(2 * cy - tay)}`,
    "Z",
  ].join(" ");
}

const defaultItems = [
  { label: "Products", link: "" },
  { label: "About", link: "" },
  { label: "Sustainability", link: "" },
  { label: "Journal", link: "" },
];

export default function GooeyNavbar(props: any) {
  const {
    items = defaultItems,
    pillColor,
    hoverPillColor,
    textColor,
    hoverTextColor,
    font,
    uppercase,
    letterSpacing,
    fontSize,
    paddingX,
    paddingY,
    cornerRadius,
    gap,
    neighborPush,
    anchorEdge,
    neckRatio,
    glowSize,
    activeFrom,
    scrollDuration,
    scrollOffset,
    activePreview,
    onSelect,
    transition,
    style,
  } = props;

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [rects, setRects] = React.useState<any[]>([]);
  const [currentPath, setCurrentPath] = React.useState<string | null>(null);
  const [pointerInside, setPointerInside] = React.useState(false);
  const isStatic = false;
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);
  const inView = useInView(containerRef, { amount: 0.2 });

  const activeIndex = !isStatic && inView ? hoveredIndex : null;
  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);
  const rectsRef = React.useRef<any[]>([]);
  const hoveredRef = React.useRef<number | null>(null);

  const trackPointer = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const bounds = container.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      pointerX.set(x);
      pointerY.set(event.clientY - bounds.top);

      const list = rectsRef.current;
      let nearest = null;
      let shortest = Infinity;
      for (let index = 0; index < list.length; index++) {
        const rect = list[index];
        const distance = x < rect.x ? rect.x - x : x > rect.x + rect.width ? x - (rect.x + rect.width) : 0;
        if (distance < shortest) {
          shortest = distance;
          nearest = index;
        }
      }
      if (nearest !== hoveredRef.current) {
        hoveredRef.current = nearest;
        React.startTransition(() => setHoveredIndex(nearest));
      }
      if (!pointerInside) {
        React.startTransition(() => setPointerInside(true));
      }
    },
    [pointerInside, pointerX, pointerY],
  );

  const activate = React.useCallback((index: number) => {
    hoveredRef.current = index;
    React.startTransition(() => setHoveredIndex(index));
  }, []);

  const deactivate = React.useCallback(() => {
    hoveredRef.current = null;
    React.startTransition(() => {
      setHoveredIndex(null);
      setPointerInside(false);
    });
  }, []);

  const setItemRef = React.useCallback((index: number, node: HTMLAnchorElement | HTMLButtonElement | null) => {
    itemRefs.current[index] = node;
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentPath(toPath(window.location.pathname));
  }, []);

  const [sectionIndex, setSectionIndex] = React.useState<number | null>(null);
  const scrollLockRef = React.useRef(0);

  React.useEffect(() => {
    if (isStatic || activeFrom !== "section") return;
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;
    const targets: Array<{ index: number; element: Element }> = [];
    items.forEach((item: any, index: number) => {
      const id = toHash(item.link);
      if (!id) return;
      const element = document.getElementById(id);
      if (element) targets.push({ index, element });
    });
    if (targets.length === 0) return;
    const inBand = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        if (performance.now() < scrollLockRef.current) return;
        const hit = targets.find((target) => inBand.has(target.element));
        React.startTransition(() => setSectionIndex(hit ? hit.index : null));
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    for (const target of targets) observer.observe(target.element);
    return () => observer.disconnect();
  }, [isStatic, activeFrom, items, scrollDuration]);

  const [clickedIndex, setClickedIndex] = React.useState<number | null>(null);
  const scrollFrameRef = React.useRef<number | null>(null);

  const select = React.useCallback(
    (index: number, event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (activeFrom === "click") {
        React.startTransition(() => setClickedIndex(index));
        onSelect?.(index);
        return;
      }
      if (activeFrom !== "section" || typeof window === "undefined") return;
      const id = toHash(items[index]?.link);
      if (!id) return;
      const element = document.getElementById(id);
      if (!element) return;

      event.preventDefault();
      const destination = element.getBoundingClientRect().top + window.scrollY - (scrollOffset ?? 0);
      const start = window.scrollY;
      const distance = destination - start;
      React.startTransition(() => setSectionIndex(index));
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduced || (scrollDuration ?? 0) <= 0 || Math.abs(distance) < 1) {
        window.scrollTo(0, destination);
        scrollLockRef.current = performance.now() + 120;
        return;
      }
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      scrollLockRef.current = performance.now() + (scrollDuration ?? 0) + 150;
      const began = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        const progress = Math.min((now - began) / (scrollDuration ?? 0), 1);
        window.scrollTo(0, start + distance * ease(progress));
        if (progress < 1) {
          scrollFrameRef.current = requestAnimationFrame(step);
        }
      };
      scrollFrameRef.current = requestAnimationFrame(step);
    },
    [activeFrom, items, onSelect, scrollDuration, scrollOffset],
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stop = () => {
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      scrollLockRef.current = 0;
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);

  const currentIndex = React.useMemo(() => {
    const preview = activePreview - 1;
    const fallback = preview >= 0 && preview < items.length ? preview : null;
    if (isStatic) return fallback;
    if (activeFrom === "click") return clickedIndex ?? fallback;
    if (activeFrom === "section") return sectionIndex ?? fallback;
    if (currentPath === null) return fallback;
    const match = items.findIndex((item: any) => toPath(item.link) === currentPath);
    return match === -1 ? null : match;
  }, [activeFrom, isStatic, currentPath, sectionIndex, clickedIndex, activePreview, items]);

  const dotSize = Math.max(3, Math.round((fontSize ?? 14) * 0.28));
  const dotBottom = Math.max(3, Math.round((paddingY ?? 15) * 0.32));
  const shouldStretch = style?.width === "100%";
  const textStyle = React.useMemo(
    () => ({
      fontFamily: font?.fontFamily,
      fontWeight: font?.fontWeight,
      fontStyle: font?.fontStyle,
      lineHeight: font?.lineHeight,
      fontSize: fontSize ?? 14,
      letterSpacing: `${letterSpacing ?? 1}px`,
      textTransform: uppercase ? "uppercase" : "none",
      textAlign: font?.textAlign ?? "center",
      whiteSpace: "nowrap",
      minWidth: "max-content",
    }),
    [font, fontSize, letterSpacing, uppercase],
  );

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const next: any[] = [];
    for (let index = 0; index < items.length; index++) {
      const element = itemRefs.current[index];
      if (!element) return;
      let x = element.offsetLeft;
      let y = element.offsetTop;
      let parent = element.offsetParent as HTMLElement | null;
      while (parent && parent !== container) {
        x += parent.offsetLeft;
        y += parent.offsetTop;
        parent = parent.offsetParent as HTMLElement | null;
      }
      next.push({ x, y, width: element.offsetWidth, height: element.offsetHeight });
    }
    React.startTransition(() => setRects(next));
  }, [items]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    measure();
    const container = containerRef.current;
    if (!container) return;
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => measure());
      resizeObserver.observe(container);
      for (const node of itemRefs.current) {
        if (node) resizeObserver.observe(node);
      }
    }
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const fonts = document.fonts as any;
    if (fonts?.ready) fonts.ready.then(() => measure());
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [items, gap, paddingX, paddingY, font, fontSize, letterSpacing, uppercase, shouldStretch, measure]);

  const estimatedRects = React.useMemo(() => {
    let x = 0;
    return items.map((item: any) => {
      const width = item.label.length * (fontSize * 0.62 + (letterSpacing ?? 1)) + (paddingX ?? 24) * 2;
      const height = (fontSize ?? 14) + (paddingY ?? 15) * 2;
      const rect = { x, y: 0, width, height };
      x += width + (gap ?? 12);
      return rect;
    });
  }, [items, fontSize, letterSpacing, paddingX, paddingY, gap]);

  const hasMeasured = rects.length === items.length && rects.length > 0;
  const baseRects = hasMeasured ? rects : estimatedRects;
  const pillHeight = baseRects[0]?.height ?? (fontSize ?? 14) + (paddingY ?? 15) * 2;
  const radiusPx = React.useMemo(() => {
    const parsed = Number.parseFloat(String(cornerRadius ?? pillHeight * 0.34));
    const value = Number.isFinite(parsed) ? parsed : pillHeight * 0.34;
    return Math.min(Math.max(value, 0), pillHeight / 2);
  }, [cornerRadius, pillHeight]);

  const targets = React.useMemo(() => {
    const isOpen = (index: number) => index === activeIndex || index === currentIndex;
    return baseRects.slice(0, -1).map((_: any, index: number) => (isOpen(index) || isOpen(index + 1) ? 1 : 0));
  }, [baseRects, activeIndex, currentIndex]);

  const [openness, setOpenness] = React.useState<number[]>([]);
  const valuesRef = React.useRef<number[]>([]);
  const velocityRef = React.useRef<number[]>([]);

  const layoutRef = React.useRef({ baseRects, gap: gap ?? 12, neighborPush: neighborPush ?? 0 });
  layoutRef.current = { baseRects, gap: gap ?? 12, neighborPush: neighborPush ?? 0 };

  const spreadFrom = React.useCallback((open: number[]) => {
    const { baseRects: rects, gap: g, neighborPush: push } = layoutRef.current;
    const out = new Array(rects.length);
    if (rects.length === 0) return out;
    out[0] = rects[0].x;
    for (let index = 1; index < rects.length; index++) {
      out[index] = out[index - 1] + rects[index - 1].width + g + push * (open[index - 1] ?? 0);
    }
    return out;
  }, []);

  React.useEffect(() => {
    if (isStatic) {
      valuesRef.current = [...targets];
      setOpenness([...targets]);
      return;
    }

    const stiffness = transition?.stiffness ?? 260;
    const damping = transition?.damping ?? 30;
    const mass = Math.max(transition?.mass ?? 1, 0.01);
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const values = valuesRef.current;
      const velocity = velocityRef.current;
      let settling = false;
      for (let index = 0; index < targets.length; index++) {
        const target = targets[index];
        const x = values[index] ?? target;
        const v = velocity[index] ?? 0;
        const accel = (-stiffness * (x - target) - damping * v) / mass;
        const nextV = v + accel * dt;
        const nextX = x + nextV * dt;
        if (Math.abs(nextX - target) > 0.002 || Math.abs(nextV) > 0.02) {
          values[index] = nextX;
          velocity[index] = nextV;
          settling = true;
        } else {
          values[index] = target;
          velocity[index] = 0;
        }
      }
      values.length = targets.length;
      velocity.length = targets.length;
      setOpenness([...values]);
      if (settling) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [targets, isStatic, transition]);

  const openAt = React.useCallback((index: number) => openness[index] ?? targets[index] ?? 0, [openness, targets]);

  const shifts = React.useMemo(() => {
    const count = baseRects.length;
    if (count === 0) return [];
    const open = baseRects.slice(0, -1).map((_: any, index: number) => openAt(index));
    const positions = spreadFrom(open);
    const last = count - 1;
    const grown = positions[last] + baseRects[last].width - positions[0];
    const resting = baseRects[last].x + baseRects[last].width - baseRects[0].x;
    const growth = grown - resting;
    const balance = (xs: number[]) => {
      let moment = 0;
      let total = 0;
      for (let index = 0; index < count; index++) {
        const width = baseRects[index].width;
        moment += (xs[index] + width / 2) * width;
        total += width;
      }
      return total > 0 ? moment / total : 0;
    };
    const offset = anchorEdge === "left" ? 0 : anchorEdge === "right" ? -growth : balance(baseRects.map((rect: any) => rect.x)) - balance(positions);
    return positions.map((x, index) => x + offset - baseRects[index].x);
  }, [baseRects, openAt, spreadFrom, anchorEdge]);

  const shapeRects = React.useMemo(
    () => baseRects.map((rect: any, index: number) => ({ ...rect, x: rect.x + (shifts[index] ?? 0) })),
    [baseRects, shifts],
  );
  rectsRef.current = shapeRects;

  const shapeData = React.useMemo(() => {
    const parts: string[] = [];
    for (const rect of shapeRects) parts.push(pillPath(rect, radiusPx));
    for (let index = 0; index < shapeRects.length - 1; index++) {
      const d = waistPath(shapeRects[index], shapeRects[index + 1], radiusPx, pillHeight * (neckRatio ?? 0.72), openAt(index));
      if (d) parts.push(d);
    }
    return parts.join(" ");
  }, [shapeRects, radiusPx, pillHeight, neckRatio, openAt]);

  const reactId = React.useId();
  const glowId = `goo-glow-${reactId.replace(/:/g, "")}`;
  const gradientRef = React.useRef<SVGStopElement | null>(null);
  React.useEffect(() => {
    const follow = (value: any, axis: "cx" | "cy") => {
      const handler = (next: number) => gradientRef.current?.setAttribute(axis, String(next));
      return typeof value.on === "function" ? value.on("change", handler) : value.onChange?.(handler);
    };
    const stopX = follow(pointerX, "cx");
    const stopY = follow(pointerY, "cy");
    return () => {
      stopX?.();
      stopY?.();
    };
  }, [pointerX, pointerY]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "block", width: shouldStretch ? "100%" : "max-content", ...style }}
      onMouseMove={isStatic ? undefined : trackPointer}
      onMouseLeave={deactivate}
    >
      <svg
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "visible" }}
      >
        <defs>
          <radialGradient
            ref={gradientRef as any}
            id={glowId}
            gradientUnits="userSpaceOnUse"
            cx={-9999}
            cy={-9999}
            r={glowSize ?? 90}
          >
            <stop offset="0" stopColor={hoverPillColor ?? "#EFF4C8"} stopOpacity={1} />
            <stop offset="0.45" stopColor={hoverPillColor ?? "#EFF4C8"} stopOpacity={0.55} />
            <stop offset="1" stopColor={hoverPillColor ?? "#EFF4C8"} stopOpacity={0} />
          </radialGradient>
        </defs>
        <path d={shapeData} fill={pillColor ?? "#FFFFFF"} fillRule="nonzero" />
        {!isStatic && (
          <motion.path
            d={shapeData}
            fill={`url(#${glowId})`}
            fillRule="nonzero"
            initial={false}
            animate={{ opacity: pointerInside ? 1 : 0 }}
            transition={transition}
          />
        )}
      </svg>

      <nav
        aria-label="Main"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: shouldStretch ? "center" : "flex-start",
          gap: undefined,
          width: shouldStretch ? "100%" : "max-content",
          minWidth: shouldStretch ? undefined : "max-content",
          position: "relative",
          zIndex: 1,
        }}
      >
        {items.map((item: any, index: number) => {
          const isHovered = activeIndex === index;
          const isCurrent = currentIndex === index;
          const sharedStyle = {
            ...textStyle,
            color: isHovered ? hoverTextColor ?? "#111111" : textColor ?? "#111111",
            paddingTop: paddingY ?? 15,
            paddingBottom: paddingY ?? 15,
            paddingLeft: paddingX ?? 24,
            paddingRight: paddingX ?? 24,
            position: "relative" as const,
          };

          const interaction = {
            onMouseEnter: () => activate(index),
            onFocus: () => activate(index),
            onBlur: deactivate,
            onClick: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => select(index, event),
            ref: (node: HTMLAnchorElement | HTMLButtonElement | null) => setItemRef(index, node),
            animate: {
              color: isHovered ? hoverTextColor ?? "#111111" : textColor ?? "#111111",
              x: shifts[index] ?? 0,
            },
            transition: { duration: 0 },
            style: sharedStyle,
          };

          const dot = isCurrent ? (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "50%",
                bottom: dotBottom,
                marginLeft: -dotSize / 2,
                width: dotSize,
                height: dotSize,
                borderRadius: "50%",
                backgroundColor: "currentColor",
              }}
            />
          ) : null;

          return item.link ? (
            <motion.a key={`${item.label}-${index}`} href={item.link} {...interaction} aria-current={isCurrent ? "page" : undefined}>
              {item.label}
              {dot}
            </motion.a>
          ) : (
            <motion.button key={`${item.label}-${index}`} type="button" {...interaction} aria-current={isCurrent ? "page" : undefined}>
              {item.label}
              {dot}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

