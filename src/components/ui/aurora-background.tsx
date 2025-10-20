"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-cyan-400/10 via-blue-400/10 to-purple-400/10 animate-aurora"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-400/5 to-purple-400/5"></div>
        </div>
        {children}
      </div>
    </main>
  );
};
