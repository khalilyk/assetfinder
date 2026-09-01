"use client";

import { useEffect, useRef, useState } from "react";
import { CountUp } from "@/components/CountUp";

const CX = 100;
const CY = 100;
const R = 90;

function point(percent: number, r: number) {
  const angleDeg = 180 - (percent / 100) * 180;
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}

const ticks = [0, 25, 50, 75, 100].map((p) => {
  const outer = point(p, R + 9);
  const inner = point(p, R - 9);
  const label = point(p, R - 26);
  return { p, outer, inner, label };
});

export function Gauge({
  value,
  decimals = 0,
  label,
}: {
  value: number;
  decimals?: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => setAnimate(true));
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const clamped = Math.min(100, Math.max(0, value));
  const angle = (clamped / 100) * 180 - 90;
  const circumference = Math.PI * R;
  const dash = (clamped / 100) * circumference;

  return (
    <div ref={ref} className="mx-auto w-44 shrink-0 sm:mr-6 sm:w-48">
      <svg viewBox="0 0 200 118" className="w-full overflow-visible">
        <path
          d="M10,100 A90,90 0 0 1 190,100"
          fill="none"
          stroke="rgba(11,14,18,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M10,100 A90,90 0 0 1 190,100"
          fill="none"
          stroke="#c8e600"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference - dash : circumference}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.16,1,0.3,1)" }}
        />

        {ticks.map(({ p, outer, inner, label: lp }) => (
          <g key={p}>
            <line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(11,14,18,0.25)"
              strokeWidth="1.5"
            />
            <text
              x={lp.x}
              y={lp.y}
              fontSize="9"
              fill="rgba(11,14,18,0.35)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {p}
            </text>
          </g>
        ))}

        <g
          style={{
            transformOrigin: "100px 100px",
            transform: `rotate(${animate ? angle : -90}deg)`,
            transition: "transform 1.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <line x1="100" y1="100" x2="100" y2="30" stroke="#0b0e12" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <circle cx={CX} cy={CY} r="7" fill="#0b0e12" />
        <circle cx={CX} cy={CY} r="3" fill="#fff" />
      </svg>
      <p className="-mt-1 text-center text-2xl font-bold text-brand-dark">
        <CountUp end={clamped} decimals={decimals} suffix="%" />
      </p>
      <p className="text-center text-xs tracking-wide text-black/40">{label}</p>
    </div>
  );
}
