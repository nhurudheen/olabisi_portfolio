import type { ReactNode, ElementType, CSSProperties } from "react";
import { useReveal } from "@/hooks/use-reveal";

type Direction = "up" | "down" | "left" | "right" | "fade";

const offsets: Record<Direction, string> = {
  up: "translate3d(0, 24px, 0)",
  down: "translate3d(0, -24px, 0)",
  left: "translate3d(24px, 0, 0)",
  right: "translate3d(-24px, 0, 0)",
  fade: "translate3d(0, 0, 0)",
};

export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  duration = 700,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const style: CSSProperties = {
    transition: `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0,0,0)" : offsets[direction],
    willChange: "opacity, transform",
  };
  return (
    <Tag ref={ref as never} style={style} className={className}>
      {children}
    </Tag>
  );
}
