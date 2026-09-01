export function WaveConnector({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 20"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute left-0 right-0 top-3 hidden h-5 w-full sm:block ${className}`}
    >
      <path
        d="M0,10 Q12.5,2 25,10 T50,10 T75,10 T100,10 T125,10 T150,10 T175,10 T200,10 T225,10 T250,10 T275,10 T300,10"
        fill="none"
        stroke="rgba(11,14,18,0.15)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        strokeLinecap="round"
        className="animate-wave-flow"
      />
    </svg>
  );
}
