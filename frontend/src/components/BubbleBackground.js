import React, { useEffect, useRef } from "react";

/**
 * BubbleBackground
 * - soft floating bubbles with subtle parallax & mouse repel
 * - zero-click blocking (pointer-events: none)
 * - honors prefers-reduced-motion
 */
export default function BubbleBackground({
  count = 80,                  // number of bubbles
  minR = 6,                    // min radius (px)
  maxR = 20,                   // max radius (px)
  rise = [0.15, 0.6],          // vertical speed range (px/frame)
  drift = [0.1, 0.35],         // horizontal drift range
  colors = ["#a78bfa", "#60a5fa", "#22d3ee", "#f472b6"], // gradient palette
  mouseRadius = 110,           // repel radius
  zIndex = 0,
}) {
  const canvasRef = useRef(null);
  const bubblesRef = useRef([]);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: -1e9, y: -1e9 });

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d", { alpha: true });

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const sizeCanvas = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      cvs.width = Math.floor(w * DPR);
      cvs.height = Math.floor(h * DPR);
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[(Math.random() * arr.length) | 0];

    const makeBubbles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      bubblesRef.current = Array.from({ length: count }, () => {
        const r = rand(minR, maxR);
        const speedY = rand(rise[0], rise[1]);
        const speedX = (Math.random() < 0.5 ? -1 : 1) * rand(drift[0], drift[1]);
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vx: speedX,
          vy: -speedY,
          tint: pick(colors),
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: rand(0.005, 0.02),
          alpha: rand(0.35, 0.8),
        };
      });
    };

    const drawBubble = (b) => {
      // radial gradient bubble
      const g = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r);
      g.addColorStop(0, hexToRgba(b.tint, Math.min(1, b.alpha)));
      g.addColorStop(1, hexToRgba("#ffffff", 0.02));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      // small highlight
      ctx.fillStyle = hexToRgba("#ffffff", 0.12);
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    };

    const hexToRgba = (hex, a = 1) => {
      const h = hex.replace("#", "");
      const bigint = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r},${g},${b},${a})`;
    };

    sizeCanvas();
    makeBubbles();

    let last = performance.now();
    const loop = (t) => {
      rafRef.current = requestAnimationFrame(loop);
      const dt = Math.min(0.033, (t - last) / 1000);
      last = t;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const B = bubblesRef.current;

      for (let i = 0; i < B.length; i++) {
        const b = B[i];

        // wobble (gentle left-right sway)
        b.wobble += b.wobbleSpeed;
        const sway = Math.sin(b.wobble) * 0.3;
        b.x += (b.vx + sway);
        b.y += b.vy;

        // mouse repel
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < mouseRadius * mouseRadius) {
          const d = Math.sqrt(d2) || 0.0001;
          const ux = dx / d;
          const uy = dy / d;
          const strength = (1 - d / mouseRadius) * 40 * dt;
          b.x += ux * strength * 20;
          b.y += uy * strength * 20;
        }

        // wrap to bottom/top and sides
        if (b.y + b.r < -10) {
          b.y = h + b.r + 10;
          b.x = Math.random() * w;
        }
        if (b.x < -b.r - 20) b.x = w + b.r + 20;
        if (b.x > w + b.r + 20) b.x = -b.r - 20;

        drawBubble(b);
      }
    };

    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onLeave = () => {
      mouseRef.current.x = -1e9;
      mouseRef.current.y = -1e9;
    };
    const onResize = () => {
      sizeCanvas();
      makeBubbles();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    if (!reduceMotion) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      // still background
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      bubblesRef.current.forEach(drawBubble);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [count, minR, maxR, rise, drift, colors, mouseRadius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  );
}
