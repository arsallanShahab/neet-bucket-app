import { cn } from "@/lib/utils";
import { removeFromCart } from "@/redux/reducer/cart";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserNav } from "./UserNav";
import { Logo } from "./icons";
import { Avatar } from "./ui/avatar";

const Navbar = () => {
  const { totalQuantity } = useSelector((state) => state.cart);

  const [search, setSearch] = useState("");
  const pathname = useRouter().pathname;
  console.log(pathname);
  const { user } = useSelector((state) => state.auth);
  const navRef = useRef(null);
  const handleMenuOpen = () => {
    if (navRef.current) {
      navRef.current.classList.toggle("responsive-nav");
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      window.location.href = `/search?q=${search.toLowerCase()}`;
    }
  };

  const dispatch = useDispatch();

  return (
    <>
      <div
        className={cn(
          "flex-row-between sticky top-0 z-[700] mx-auto w-full max-w-screen-2xl flex-wrap gap-5 border-b bg-white px-5 py-5 md:px-10",
          pathname == "/login" && " hidden",
        )}
      >
        <div className="flex-row-start flex-1 flex-wrap gap-5 md:gap-10">
          <Link href={"/"}>
            <Logo height="25px" />
          </Link>
          <Button
            onClick={handleMenuOpen}
            variant="outline"
            className="ml-auto block h-auto text-xs sm:hidden"
          >
            Menu
          </Button>
          <nav
            ref={navRef}
            className="responsive-nav flex w-full flex-col justify-start gap-5 sm:flex sm:w-auto sm:flex-row"
          >
            {[
              { name: "Home", path: "/" },
              { name: "Soft Copy", path: "/soft-copy" },
              { name: "Hard Copy", path: "/hard-copy" },
              // { name: "About Us", path: "/about-us" },
              { name: "Contact Us", path: "/contact-us" },
            ].map((item, index) => {
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
        <div className="flex w-full flex-col items-center justify-end gap-5 md:w-auto md:flex-row">
          <Input
            type="search"
            placeholder="Search..."
            labelPlacement="outside"
            classNames={{
              input: "font-medium",
              inputWrapper:
                "ring-2 ring-transparent focus-within:ring-2 focus-within:ring-zinc-200 transition-all duration-200 ease-in-out",
            }}
            onKeyPress={handleSearch}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex w-full items-center justify-between gap-5 md:w-auto">
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
              <div className="flex items-center gap-2.5">
                <Link href="/login">
                  <Button className="rounded-md" variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="rounded-md bg-zinc-800 text-white"
                    variant="solid"
                  >
                    Signup
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
