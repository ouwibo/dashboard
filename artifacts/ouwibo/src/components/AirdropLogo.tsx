import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AirdropLogo({
  name,
  logoUrl,
  logoInitial,
  logoColor,
  size = 40,
  className,
}: {
  name: string;
  logoUrl?: string;
  logoInitial: string;
  logoColor: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [logoUrl, name]);

  const px = `${size}px`;

  return (
    <div
      title={name}
      aria-label={name}
      className={cn(
        "relative flex items-center justify-center overflow-hidden shrink-0 rounded-xl border border-white/10 text-white font-black shadow-sm",
        className
      )}
      style={{
        width: px,
        height: px,
        background: logoColor,
        fontSize: Math.max(10, size * 0.34),
      }}
    >
      {logoUrl && !failed ? (
        <img
          src={logoUrl}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
          {logoInitial}
        </span>
      )}
    </div>
  );
}
