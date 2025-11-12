// src/widgets/ui/ui.jsx  ← 새 파일
function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

export function PageShell({ title, right, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-screen-sm px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-semibold">{title}</h1>
          {right}
        </div>
      </header>
      <main className="mx-auto max-w-screen-sm w-full px-4 py-3">
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
