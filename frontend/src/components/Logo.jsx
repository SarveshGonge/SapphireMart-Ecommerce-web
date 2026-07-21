export default function Logo({
  iconSize = 40,
  showText = true,
  textClassName = "",
  className = "",
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="SapphireMart"
        width={iconSize}
        height={iconSize}
        className="object-contain"
      />

      {showText && (
        <span className={`font-display text-2xl ${textClassName}`}>
          <span style={{ color: "rgb(255, 63, 108)" }}>
            Sapphire
          </span>
          <span className="font-normal opacity-100">
            Mart
          </span>
        </span>
      )}
    </span>
  );
}