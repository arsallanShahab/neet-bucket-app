import { cn } from "@/lib/utils";
import React from "react";

const Wrapper = ({ children, className }) => {
  return (
    <div className="min-h-screen w-full">
      <div
        className={cn(
          "*:w-full mx-auto flex max-w-screen-xl flex-col items-start justify-start gap-5 p-5",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
