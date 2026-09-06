import type { ReactNode } from "react";

/**
 * The recurring section marker: a hairline, an index, a label. It's the only
 * navigational furniture between chapters, so it stays identical everywhere.
 */
export function Marker({
  index,
  label,
  align = "start",
  children,
}: {
  index?: string;
  label: string;
  align?: "start" | "between";
  children?: ReactNode;
}) {
  return (
    <div className="rule pt-4">
      <div
        className={`flex items-baseline gap-6 ${
          align === "between" ? "justify-between" : ""
        }`}
      >
        <span className="t-label">
          {index ? `${index} — ` : ""}
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}
