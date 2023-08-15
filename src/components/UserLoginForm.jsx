import { useFetch } from "@/lib/hooks/useFetch";
import { cn } from "@/lib/utils";
import { setToken, setUser } from "@/redux/reducer/auth";
import { Loader } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

export default function UserLoginForm({ className, ...props }) {
  // state variables for the form
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  //toast
  const { toast } = useToast();

  //redux
  const dispatch = useDispatch();

  //router
  const router = useRouter();

  // handlers for the form
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(form, "form");
    setIsLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const { success, message, payload = {} } = await res.json();
    if (!success) {
      setError(message);
    } else {
      const { token } = payload;
      dispatch(setUser(token));
      dispatch(setToken(token));
      toast({
        title: "Successful",
        description: message,
      });
      router.push("/profile");
    }
    setIsLoading(false);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              disabled={isLoading}
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
          <Label className="text-red-600">{error}</Label>
        </div>
      </form>
    </div>
  );
}

// const query = {
//   url: "https://jsonplaceholder.typicode.com/posts",
//   options: {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   },
// };
// const { data, loading, error } = useFetch(query);
