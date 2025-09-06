"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type UserDetails = {
  name: string;
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    password: "",
  });
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isLoading, startTransition] = useTransition();

  function handleUserChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [id]: value }));
  }

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();

    if (isSignUp) {
      if (
        !userDetails.name.trim() ||
        !userDetails.email.trim() ||
        !userDetails.password.trim()
      ) {
        toast.error("Please provide all details");
        return;
      }

      startTransition(async () => {
        const { data, error } = await signUp.email(
          {
            email: userDetails.email,
            password: userDetails.password, // user password -> min 8 characters by default
            name: userDetails.name,
            callbackURL: "/dashboard", // not used with email and password
          },
          {
            onRequest: (ctx) => {},
            onSuccess: (ctx) => {
              toast.success("User has been created");
              router.push("/dashboard");
            },
            onError: ({ error }) => {
              toast.error(error.message);
            },
          }
        );

        if (error) {
          toast.error(error.message as string);
        }
      });
    } else {
      if (!userDetails.email.trim() || !userDetails.password.trim()) {
        toast.error("Please provide all details");
        return;
      }
      startTransition(async () => {
        const { data, error } = await signIn.email(
          {
            email: userDetails.email,
            password: userDetails.password,
          },
          {
            onRequest: (ctx) => {},
            onSuccess: (ctx) => {
              toast.success("Successfully logged in");
              router.push("/dashboard");
            },
            onError: ({ error }) => {
              toast.error(error.message);
            },
          }
        );

        if (error) {
          toast.error(error.message as string);
        }
      });
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
      </div>
      <div className="grid gap-6">
        {isSignUp && (
          <div className="grid gap-3">
            <Label htmlFor="email">Username</Label>
            <Input
              id="name"
              type="text"
              value={userDetails.name}
              onChange={(e) => handleUserChange(e)}
              placeholder="dummy"
              required
            />
          </div>
        )}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={userDetails.email}
            onChange={(e) => handleUserChange(e)}
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a> */}
          </div>
          <Input
            id="password"
            type="password"
            value={userDetails.password}
            onChange={(e) => handleUserChange(e)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer flex items-center justify-center"
          onClick={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white" />
          ) : isSignUp ? (
            "Sign up"
          ) : (
            "Login"
          )}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24"
            height="24"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.85-6.85C35.59 2.38 30.15 0 24 0 14.64 0 6.4 5.52 2.55 13.5l7.98 6.2C12.41 13.2 17.74 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.14 24.5c0-1.57-.14-3.07-.39-4.5H24v9h12.65c-.55 2.95-2.2 5.45-4.68 7.13l7.27 5.65C43.68 38.05 46.14 31.75 46.14 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.3a14.52 14.52 0 0 1 0-8.6l-7.98-6.2A23.87 23.87 0 0 0 0 24c0 3.89.93 7.56 2.55 10.9l7.98-6.2z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.48 0 11.9-2.13 15.87-5.79l-7.27-5.65C30.64 38.07 27.5 39.5 24 39.5c-6.26 0-11.59-3.7-13.47-9.2l-7.98 6.2C6.4 42.48 14.64 48 24 48z"
            />
          </svg>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsSignUp((prev) => !prev)}
          className="underline underline-offset-4 cursor-pointer"
        >
          {isSignUp ? "Login" : "Sign up"}
        </button>
      </div>
    </form>
  );
}
