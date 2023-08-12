import Link from "next/link";
import { Logo } from "./icons";

const Footer = () => {
  return (
    <div className="flex flex-col items-center gap-5 px-10 py-10 md:flex-row md:justify-between">
      <Link href={"/"}>
        <Logo height="25px" />
      </Link>
      <div className="flex w-full flex-wrap justify-center gap-5 md:w-auto">
        {[
          { name: "Privacy Policy", link: "/privacy-policy" },
          { name: "Terms & Condition", link: "/terms-&-condition" },
          { name: "Cancellation & Refunds", link: "/cancellation-&-refunds" },
          { name: "Support", link: "/support" },
        ].map((_, i) => {
          return (
            <Link key={i} href={_.link} className="text-sm text-slate-400">
              {_.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
