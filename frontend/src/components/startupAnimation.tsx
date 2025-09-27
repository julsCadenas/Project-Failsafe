import { useState, useEffect } from "react";
import { BatmanLogo } from "./batmanLogo";

interface StartupAnimationProps {
  onComplete: () => void;
}

export function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3000),
      setTimeout(() => onComplete(), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <div
          className={`mb-8 transition-all duration-1000 ${
            stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <BatmanLogo size={120} className={stage >= 1 ? "batman-pulse" : ""} />
        </div>

        {stage >= 2 && (
          <div className="fade-in-up">
            <h1 className="text-4xl font-bold mb-2 text-foreground">BAT-COMPUTER</h1>
            <p className="text-muted-foreground text-lg">Gotham Intelligence System</p>
          </div>
        )}

        {stage >= 3 && (
          <div className="mt-8 fade-in-up">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Initializing systems...</p>
          </div>
        )}
      </div>
    </div>
  );
}
