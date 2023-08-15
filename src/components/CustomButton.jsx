import { cn } from "@/lib/utils";
import Link from "next/link";
const CustomButton = ({
  href,
  className,
  iconClassName,
  children,
  title,
  subtitle,
  props,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full origin-top items-center justify-center gap-2 rounded-xl border-[0.125em] border-indigo-600 px-4 py-3 text-sm font-semibold shadow-xl shadow-indigo-300 transition-all duration-150 active:translate-y-1 active:scale-[0.98] active:shadow-btn-active md:w-auto md:px-8 md:py-4 md:text-base",
        className,
      )}
      {...props}
    >
      {children}
      <div className="flex flex-row md:flex-col">
        {title}
        <span className="ml-2 text-xs md:ml-0 md:block">{subtitle}</span>
      </div>
    </Link>
  );
};

export default CustomButton;
