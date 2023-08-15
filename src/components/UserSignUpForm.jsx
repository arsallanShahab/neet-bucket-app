import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

export default function UserSignUpForm({ className, ...props }) {
  const [formState, setFormState] = useState({
    step_one: true,
    step_two: false,
    step_three: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { success, message } = await res.json();
    if (!success) {
      setError(message);
    }
    if (success) {
      toast({
        title: "Successful",
        description: message,
      });
      setError(null);
      router.push("/login");
    }
    setIsLoading(false);
  };

  const handleOtp = async (event) => {
    event.preventDefault();
    if (!form.email) {
      setError("Please enter email");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter valid email");
      return;
    }
    setIsLoading(true);
    const res = await fetch("/api/auth/otp/get", {
      method: "POST",
      body: JSON.stringify({ email: form.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { success, message } = await res.json();
    if (!success) {
      setError(message);
    }
    if (success) {
      toast({
        title: "Successful",
        description: message,
      });
      setFormState((prev) => ({
        ...prev,
        step_one: false,
        step_two: true,
      }));
      setError(null);
    }
    setIsLoading(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleChangeOtp = (otp) => {
    setOtp(otp);
    if (otp.length === 6) {
      setIsLoading(true);
      fetch("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ otp, email: form.email }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(({ success, message }) => {
          if (!success) {
            setError(message);
          }
          if (success) {
            toast({
              title: "Successful",
              description: message,
            });
            setFormState((prev) => ({
              ...prev,
              step_two: false,
              step_three: true,
            }));
            setError(null);
          }
          setIsLoading(false);
        });
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {formState.step_three && (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name"
                type="text"
                disabled={isLoading}
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}
          {formState.step_one && (
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
          )}
          {formState.step_three && (
            <>
              <div className="relative grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  disabled={isLoading}
                  value={form.password}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <Button
                  className={cn(
                    "absolute right-2 top-1/2 hidden h-auto -translate-y-1/2 transform rounded-md bg-slate-50 py-1.5 text-xs text-slate-950 hover:bg-slate-100",
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (e.target.innerText === "Show") {
                      e.target.previousSibling.type = "text";
                      e.target.innerText = "Hide";
                    } else {
                      e.target.innerText = "Show";
                      e.target.previousSibling.type = "password";
                    }
                  }}
                >
                  Show
                </Button>
              </div>
              <div className="relative grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Repeat Password
                </Label>
                <Input
                  id="repeatPassword"
                  placeholder="Repeat Password"
                  type="password"
                  disabled={isLoading}
                  value={form.repeatPassword}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <Button
                  className={cn(
                    "absolute right-2 top-1/2 hidden h-auto -translate-y-1/2 transform rounded-md bg-slate-50 py-1.5 text-xs text-slate-950 hover:bg-slate-100",
                  )}
                  onClick={(e) => {
                    e.preventDefault();

                    if (e.target.innerText === "Show") {
                      e.target.innerText = "Hide";
                      e.target.previousSibling.type = "text";
                    } else {
                      e.target.innerText = "Show";
                      e.target.previousSibling.type = "password";
                    }
                  }}
                >
                  Show
                </Button>
              </div>
              <Button disabled={isLoading}>
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </>
          )}
          {formState.step_two && (
            <>
              <div className="relative flex w-full justify-center px-5 py-5">
                <OTPInput
                  value={otp}
                  placeholder="000000"
                  type="number"
                  onChange={handleChangeOtp}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      style={{ width: "3rem", height: "3rem" }}
                      className="rounded-md border p-4 text-center text-base"
                    />
                  )}
                />
              </div>
            </>
          )}
          {formState.step_one && (
            <Button disabled={isLoading} onClick={handleOtp}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Get OTP
            </Button>
          )}
          <Label className="text-red-600">{error}</Label>
        </div>
      </form>
    </div>
  );
}
