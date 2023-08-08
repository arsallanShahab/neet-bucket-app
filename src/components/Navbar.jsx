import { verifyToken } from "@/lib/authUtils";
import { cn } from "@/lib/utils";
import { setLoading, setToken, setUser } from "@/redux/reducer/auth";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserNav } from "./UserNav";
import { Logo } from "./icons";
import { Avatar } from "./ui/avatar";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // console.log(token, "token");
      dispatch(setUser(token));
      dispatch(setToken(token));
    }
  }, []);
  return (
    <>
      <div className="flex-row-between mx-auto w-full max-w-screen-2xl flex-wrap gap-5 border-b px-10 py-5">
        <div className="flex-row-start gap-10">
          <Link href={"/"}>
            <Logo width="100%" height="25px" />
          </Link>
          <nav className="flex-row-start gap-5">
            {[
              { name: "Home", path: "/" },
              { name: "Subjects", path: "/subjects" },
              { name: "Teachers", path: "teachers" },
              { name: "About", path: "/about" },
            ].map((item, index) => {
              if (item.name === "Subjects") {
                return (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger className="text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-900">
                      {item.name}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href="/soft-copy">Soft copy</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/#">Hard Copy</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link
                  href={item.path}
                  key={index}
                  className="text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-row-end gap-5">
          <Input
            type="search"
            placeholder="Search..."
            className="md:w-[100px] lg:w-[300px]"
          />
          <Link
            href={"/cart"}
            className="relative rounded-xl border border-transparent bg-slate-50 hover:border-slate-200 hover:bg-slate-100"
          >
            <Avatar className="h-full w-full p-2.5 text-slate-950">
              <ShoppingCart className="h-4 w-4 object-cover" />
            </Avatar>
            <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-3xl border bg-indigo-600 text-xs text-white">
              {totalQuantity}
            </div>
          </Link>
          {user ? (
            <UserNav user={user} />
          ) : (
            <Link
              href="/user/login"
              className={cn(buttonVariants({ variant: "ghost" }), "border")}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
