'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useId } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface SmartContactLinkProps {
  /** Phone number or email address */
  value: string;
  /** Custom text to display on the trigger button (defaults to value) */
  displayText?: string;
  /** Custom CSS classes for the trigger element */
  className?: string;
  /** Custom CSS classes for the outer container */
  containerClassName?: string;
  /** Alignment of popup relative to trigger: 'left', 'center', 'right', or 'auto' */
  align?: "left" | "center" | "right" | "auto";
  /** Placement: 'top' (above) or 'bottom' (below) */
  placement?: "top" | "bottom";
  /** Optional subject line for email */
  emailSubject?: string;
  /** Optional body for email */
  emailBody?: string;
  /** Show leading icon on trigger (phone or mail icon) */
  showTriggerIcon?: boolean;
  /** Auto close popup after copy */
  closeAfterCopy?: boolean;
  /** Duration in seconds to show 'Copied!' feedback */
  copiedDuration?: number;
  /** Text configuration for phone */
  phoneText?: {
    heading?: string;
    callLabel?: string;
    copyLabel?: string;
  };
  /** Text configuration for email */
  emailText?: {
    heading?: string;
    sendLabel?: string;
    copyLabel?: string;
  };
  /** Label shown after successful copy */
  copiedLabel?: string;
  /** Custom inline style for root container */
  style?: React.CSSProperties;
  /** Optional custom trigger children */
  children?: React.ReactNode;
}

const PhoneIcon = ({ size = "1.1em" }: { size?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ width: size, height: size }}
    className="flex-none"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = ({ size = "1.1em" }: { size?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ width: size, height: size }}
    className="flex-none"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SendIcon = ({ size = "1.1em" }: { size?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ width: size, height: size }}
    className="flex-none"
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const CopyIcon = ({ size = "1.1em" }: { size?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ width: size, height: size }}
    className="flex-none"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = ({ size = "1.1em" }: { size?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ width: size, height: size }}
    className="flex-none"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const cleanPhone = (v: string) => {
  const t = v.trim();
  return (t.startsWith("+") ? "+" : "") + t.replace(/[^\d]/g, "");
};

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // fallback below
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.setAttribute("aria-hidden", "true");
  ta.style.position = "fixed";
  ta.style.top = "0";
  ta.style.left = "0";
  ta.style.opacity = "0";
  ta.style.pointerEvents = "none";
  try {
    document.body.appendChild(ta);
    ta.select();
    return document.execCommand("copy");
  } catch (e) {
    return false;
  } finally {
    if (ta.parentNode) {
      ta.parentNode.removeChild(ta);
    }
  }
}

export default function SmartContactLink({
  value,
  displayText,
  className = "",
  containerClassName = "",
  align = "auto",
  placement = "top",
  emailSubject = "",
  emailBody = "",
  showTriggerIcon = false,
  closeAfterCopy = true,
  copiedDuration = 1.4,
  phoneText = { heading: "Phone number", callLabel: "Call", copyLabel: "Copy" },
  emailText = { heading: "Email address", sendLabel: "Send email", copyLabel: "Copy" },
  copiedLabel = "Copied!",
  style,
  children,
}: SmartContactLinkProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  const [shift, setShift] = useState<{
    dx: number;
    arrow: number | null;
    resolvedAlign: "left" | "center" | "right";
  }>({
    dx: 0,
    arrow: null,
    resolvedAlign: align === "auto" ? "right" : align,
  });

  const text = (value || "").trim();
  const isEmail = text.includes("@");

  const labels = isEmail
    ? {
        heading: emailText.heading ?? "Email address",
        action: emailText.sendLabel ?? "Send email",
        copy: emailText.copyLabel ?? "Copy",
      }
    : {
        heading: phoneText.heading ?? "Phone number",
        action: phoneText.callLabel ?? "Call",
        copy: phoneText.copyLabel ?? "Copy",
      };

  let href = `tel:${cleanPhone(text)}`;
  if (isEmail) {
    const params: string[] = [];
    if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
    if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
    href = `mailto:${text}${params.length ? "?" + params.join("&") : ""}`;
  }

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Compute position & shift to stay comfortably within viewport bounds
  useIsoLayoutEffect(() => {
    if (!open) return;

    const measure = () => {
      const pop = popupRef.current;
      const anchor = anchorRef.current;
      if (!pop || !anchor) return;

      const w = pop.offsetWidth;
      const a = anchor.getBoundingClientRect();
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const m = 12; // edge margin

      const resolvedAlign: "left" | "center" | "right" =
        align === "auto" ? (a.left + a.width / 2 > vw / 2 ? "right" : "left") : align;

      const left =
        resolvedAlign === "center"
          ? a.left + a.width / 2 - w / 2
          : resolvedAlign === "right"
          ? a.right - w
          : a.left;

      let dx = 0;
      if (left + w > vw - m) dx = vw - m - (left + w);
      if (left + dx < m) dx = m - left;
      dx = Math.round(dx);

      const natural =
        resolvedAlign === "center" ? w / 2 - 5 : resolvedAlign === "right" ? w - 28 : 18;
      const arrow = Math.round(Math.min(Math.max(natural - dx, 14), Math.max(14, w - 24)));

      setShift((prev) =>
        prev.dx === dx && prev.arrow === arrow && prev.resolvedAlign === resolvedAlign
          ? prev
          : { dx, arrow, resolvedAlign }
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, align]);

  const handleCopy = async () => {
    const ok = await copyText(text);
    if (!ok) return;

    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setCopied(true);

    const ms = Math.max(0.4, Number(copiedDuration) || 1.4) * 1000;
    timers.current.push(
      window.setTimeout(() => {
        if (closeAfterCopy) setOpen(false);
        timers.current.push(
          window.setTimeout(() => setCopied(false), closeAfterCopy ? 250 : 0)
        );
      }, ms)
    );
  };

  const handleAction = () => {
    window.setTimeout(() => setOpen(false), 200);
  };

  const isTop = placement !== "bottom";
  const offset = 12;
  const currentAlign = shift.resolvedAlign;

  const popupPos: React.CSSProperties = {
    position: "absolute",
    [isTop ? "bottom" : "top"]: `calc(100% + ${offset}px)`,
  };

  if (currentAlign === "center") {
    popupPos.left = `calc(50% + ${shift.dx}px)`;
  } else if (currentAlign === "right") {
    popupPos.right = -shift.dx;
  } else {
    popupPos.left = shift.dx;
  }

  const originX =
    shift.arrow !== null
      ? `${shift.arrow + 5}px`
      : currentAlign === "center"
      ? "50%"
      : currentAlign === "right"
      ? "calc(100% - 22px)"
      : "22px";
  const originY = isTop ? "100%" : "0%";
  const slide = isTop ? 6 : -6;

  const arrowPos: React.CSSProperties = {};
  if (shift.arrow !== null) {
    arrowPos.left = shift.arrow;
  } else if (currentAlign === "center") {
    arrowPos.left = "calc(50% - 5px)";
  } else if (currentAlign === "right") {
    arrowPos.right = 18;
  } else {
    arrowPos.left = 18;
  }

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "#FFFFFF",
    transform: "rotate(45deg)",
    pointerEvents: "none",
    [isTop ? "bottom" : "top"]: -5,
    ...(isTop
      ? { borderRight: "1px solid rgba(0,0,0,0.08)", borderBottom: "1px solid rgba(0,0,0,0.08)" }
      : { borderLeft: "1px solid rgba(0,0,0,0.08)", borderTop: "1px solid rgba(0,0,0,0.08)" }),
    ...arrowPos,
  };

  const transitionConfig: Transition = {
    type: "spring",
    stiffness: 500,
    damping: 34,
    mass: 1,
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-flex items-center ${containerClassName}`}
      style={style}
    >
      <div
        ref={anchorRef}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (next && !e.currentTarget.contains(next)) {
            setOpen(false);
          }
        }}
        className="relative inline-flex max-w-full min-w-0"
        style={{ zIndex: open ? 60 : 1 }}
      >
        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-controls={open ? popupId : undefined}
          aria-expanded={open}
          aria-label={`${labels.heading}: ${text}`}
          className={`group/contact inline-flex items-center gap-1.5 bg-transparent border-0 p-0 text-inherit font-inherit cursor-pointer focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 ${className}`}
        >
          {showTriggerIcon && (
            <span className="flex-none opacity-80 group-hover/contact:opacity-100 transition-opacity">
              {isEmail ? <MailIcon /> : <PhoneIcon />}
            </span>
          )}
          {children || <span>{displayText || text}</span>}
        </button>

        {/* Smart Popup */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              ref={popupRef}
              id={popupId}
              role="dialog"
              aria-label={labels.heading}
              initial={{ opacity: 0, scale: 0.9, y: slide }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: slide }}
              transition={transitionConfig}
              style={{
                ...popupPos,
                transformOrigin: `${originX} ${originY}`,
                ...(currentAlign === "center" ? { x: "-50%" } : {}),
                boxShadow: "0px 14px 34px rgba(0,0,0,0.14), 0px 2px 8px rgba(0,0,0,0.04)",
              }}
              className="absolute z-50 whitespace-nowrap bg-white text-black rounded-[16px] p-2.5 border border-black/8 select-none normal-case"
            >
              {/* Arrow */}
              <div style={arrowStyle} />

              <div className="relative">
                {/* Heading */}
                <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.08em] uppercase text-gray-400 px-2 pt-0.5 pb-2 text-left">
                  {labels.heading}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-flow-col auto-cols-fr gap-1.5">
                  {/* Action Link (Call / Send email) */}
                  <a
                    href={href}
                    onClick={handleAction}
                    aria-label={`${labels.action}: ${text}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#F4F4F5] hover:bg-[#e26d5c] hover:text-white text-[#111111] text-xs sm:text-[13px] font-medium leading-[1.2em] transition-all duration-150 active:scale-[0.97] cursor-pointer"
                  >
                    {isEmail ? <SendIcon size="1em" /> : <PhoneIcon size="1em" />}
                    <span>{labels.action}</span>
                  </a>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={`${labels.copy}: ${text}`}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] text-xs sm:text-[13px] font-medium leading-[1.2em] transition-all duration-150 active:scale-[0.97] cursor-pointer ${
                      copied
                        ? "bg-[#10B981] text-white"
                        : "bg-[#F4F4F5] hover:bg-[#e26d5c] hover:text-white text-[#111111]"
                    }`}
                  >
                    <span className="grid place-items-center relative w-full">
                      {/* Idle state */}
                      <motion.span
                        className="col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5"
                        initial={false}
                        animate={{ opacity: copied ? 0 : 1, y: copied ? -8 : 0 }}
                        transition={transitionConfig}
                        aria-hidden={copied}
                      >
                        <CopyIcon size="1em" />
                        <span>{labels.copy}</span>
                      </motion.span>

                      {/* Copied state */}
                      <motion.span
                        className="col-start-1 row-start-1 inline-flex items-center justify-center gap-1.5 font-semibold"
                        initial={false}
                        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : 8 }}
                        transition={transitionConfig}
                        aria-hidden={!copied}
                      >
                        <CheckIcon size="1em" />
                        <span>{copiedLabel}</span>
                      </motion.span>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
