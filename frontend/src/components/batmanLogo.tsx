import batmanLogo from "../assets/batman-logo.png";

interface BatmanLogoProps {
  className?: string;
  size?: number;
  src?: string;
}

export function BatmanLogo({
  className = "",
  size = 80,
  // src = "../assets/batman-logo.png",
}: BatmanLogoProps) {
  return (
    <img
      src={batmanLogo}
      alt="Batman Logo"
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
