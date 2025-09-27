import { BatmanLogo } from "./batmanLogo";

interface ChatHeaderProps {
  status: "ONLINE" | "OFFLINE" | "CHECKING";
}

export function ChatHeader({ status }: ChatHeaderProps) {
  return (
    <div className="border-b border-border bg-card flex-none px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4">
        <div className="flex items-center space-x-3">
          <BatmanLogo size={48} />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">BAT-COMPUTER</h1>
            <p className="text-sm text-muted-foreground">Gotham Intelligence System</p>
          </div>
        </div>
        <div className="flex flex-row gap-1 mt-2 sm:mt-0 text-xs font-semibold">
          <p className="text-muted-foreground">Status:</p>
          <p
            className={
              status === "ONLINE"
                ? "text-green-400"
                : status === "OFFLINE"
                ? "text-red-400"
                : "text-yellow-400"
            }
          >
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
