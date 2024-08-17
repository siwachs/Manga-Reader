const ModelOverlay: React.FC<{
  children?: React.ReactNode;
  zIndex?: number;
  blackBg?: boolean;
}> = ({ children, zIndex = 999, blackBg = false }) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[${zIndex}] ${blackBg ? "bg-[var(--app-text-color-primary)]" : "bg-[var(--app-background-overlay-transparent-black)]"}`}
    >
      {children}
    </div>
  );
};

export default ModelOverlay;
