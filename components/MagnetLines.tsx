"use client";

/**
 * MagnetLines — animated canvas background
 * Inspired by: reactbits.dev/tools/background-studio?bg=magnet-lines
 *
 * Renders a field of needle-shaped lines whose tips are attracted towards the
 * cursor (or a slow drifting point on touch / no-pointer devices).
 * The animation is automatically paused when `prefers-reduced-motion` is set.
 */

import { useEffect, useRef } from "react";

interface MagnetLinesProps {
  /** Colour of the needle lines (CSS colour string). */
  color?: string;
  /** Space between grid points in px. Default 26. */
  spacing?: number;
  /** Stroke width of each needle. Default 1.5. */
  lineWidth?: number;
  /** Half-length of each needle in px. Default 13. */
  lineHeight?: number;
  /** Extra class names applied to the <canvas> element. */
  className?: string;
}

export function MagnetLines({
  color = "rgba(99, 102, 241, 0.18)",
  spacing = 26,
  lineWidth = 1.5,
  lineHeight = 13,
  className = "",
}: MagnetLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;

    // Mouse / touch tracking
    let mx = -9999;
    let my = -9999;
    // Slow drift for no-pointer environments
    let driftAngle = 0;

    function resize() {
      width = canvas!.width = canvas!.offsetWidth;
      height = canvas!.height = canvas!.offsetHeight;
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }

    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      const rect = canvas!.getBoundingClientRect();
      mx = t.clientX - rect.left;
      my = t.clientY - rect.top;
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Drift fallback when no pointer inside
      if (mx < 0) {
        driftAngle += 0.004;
        mx = width / 2 + Math.cos(driftAngle) * width * 0.3;
        my = height / 2 + Math.sin(driftAngle * 1.3) * height * 0.25;
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = mx - x;
          const dy = my - y;
          const angle = Math.atan2(dy, dx);

          // Attraction falls off with distance (max pull at 0, none at 200 px)
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = Math.max(0, 1 - dist / 200);

          // Baseline: horizontal. Rotate toward cursor proportional to pull.
          const finalAngle = pull * angle;

          const cos = Math.cos(finalAngle);
          const sin = Math.sin(finalAngle);

          ctx.beginPath();
          ctx.moveTo(x - cos * lineHeight, y - sin * lineHeight);
          ctx.lineTo(x + cos * lineHeight, y + sin * lineHeight);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [color, spacing, lineWidth, lineHeight]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 h-full w-full ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
