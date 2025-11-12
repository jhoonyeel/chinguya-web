// src/widgets/ui/ui.jsx  ← 교체
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

/**
 * PageShell
 * - 헤더는 sticky, 본문은 페이지별로 패딩/스크롤 제어
 * - mainScrollable=true 이면 본문이 남은 높이를 차지하며 내부 스크롤됨
 */
export function PageShell({
  title,
  right,
  children,
  mainClassName = "px-4 py-3",
  mainScrollable = false,
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-screen-sm px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-semibold">{title}</h1>
          {right}
        </div>
      </header>

      <main
        className={cn(
          "mx-auto max-w-screen-sm w-full",
          mainClassName,
          mainScrollable && "flex-1 min-h-0 overflow-y-auto"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function Card({ className, children }) {
  return (
    <div className={cn("bg-white border rounded-xl shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "solid",
  size = "md",
  className,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg border transition active:scale-[0.98] disabled:opacity-50";
  const variants = {
    solid: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
    outline: "bg-white text-gray-900 border-gray-300 hover:bg-gray-50",
    ghost: "bg-transparent border-transparent text-gray-700 hover:bg-gray-100",
  };
  const sizes = { sm: "h-9 px-3 text-sm", md: "h-10 px-4 text-sm" };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
