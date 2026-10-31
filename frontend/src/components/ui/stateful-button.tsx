"use client";

import React, { useState } from "react";
import { motion, useAnimate, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface StatefulButtonProps
  extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
}

export function StatefulButton({
  className,
  children,
  onClick,
  disabled,
  ...props
}: StatefulButtonProps) {
  const [scope, animate] = useAnimate();
  const [running, setRunning] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (running || disabled) return;

    setRunning(true);
    try {
      await animate(
        ".stateful-loader",
        { width: "18px", scale: 1, opacity: 1, display: "block" },
        { duration: 0.18, ease: "easeOut" },
      );

      await onClick?.(event);

      await animate(
        ".stateful-loader",
        { width: "0px", scale: 0, opacity: 0, display: "none" },
        { duration: 0.16, ease: "easeIn" },
      );
      await animate(
        ".stateful-check",
        { width: "18px", scale: 1, opacity: 1, display: "block" },
        { duration: 0.18, ease: "easeOut" },
      );
      await animate(
        ".stateful-check",
        { width: "0px", scale: 0, opacity: 0, display: "none" },
        { delay: 1.15, duration: 0.16, ease: "easeIn" },
      );
    } finally {
      await animate(
        ".stateful-loader, .stateful-check",
        { width: "0px", scale: 0, opacity: 0, display: "none" },
        { duration: 0.12 },
      );
      setRunning(false);
    }
  };

  return (
    <motion.button
      ref={scope}
      type={props.type ?? "button"}
      disabled={disabled || running}
      aria-busy={running || undefined}
      className={cn(
        "inline-flex min-w-[140px] cursor-pointer items-center transition-[background-color,border-color,box-shadow,transform] duration-200 disabled:cursor-not-allowed motion-reduce:transition-none",
        className,
      )}
      {...props}
      onClick={handleClick}
    >
      <motion.span layout className="inline-flex items-center justify-center gap-2.5">
        <motion.svg
          initial={{ width: 0, scale: 0, opacity: 0, display: "none" }}
          className="stateful-loader shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={running ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.65, repeat: running ? Infinity : 0, ease: "linear" }}
          aria-hidden="true"
        >
          <path d="M12 3a9 9 0 1 0 9 9" />
        </motion.svg>

        <motion.svg
          initial={{ width: 0, scale: 0, opacity: 0, display: "none" }}
          className="stateful-check shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </motion.svg>

        <motion.span layout>{children}</motion.span>
      </motion.span>
    </motion.button>
  );
}
