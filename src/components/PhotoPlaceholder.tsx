const gradients: Record<string, string> = {
  valve: "linear-gradient(160deg, #3a1f14 0%, #1c1410 45%, #0b0e12 100%)",
  scan: "linear-gradient(160deg, #2a2116 0%, #17130f 50%, #0b0e12 100%)",
  builder: "linear-gradient(160deg, #2b2a1a 0%, #16160f 55%, #0b0e12 100%)",
  contractor: "linear-gradient(160deg, #3a1512 0%, #1c0f0e 55%, #0b0e12 100%)",
  certifier: "linear-gradient(160deg, #14232a 0%, #0f171a 55%, #0b0e12 100%)",
};

export function PhotoPlaceholder({
  variant,
  icon,
  className = "",
}: {
  variant: keyof typeof gradients;
  icon: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: gradients[variant] }}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <span className="relative text-5xl opacity-70 drop-shadow-lg" aria-hidden>
        {icon}
      </span>
    </div>
  );
}
