import { useState } from "react";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { API_URL } from "../lib/config";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginErrors, setLoginErrors] = useState("");

  const loginSchema = z.object({
    username: z
      .string()
      .trim()
      .min(3, { error: "Username must be at least 3 character" })
      .max(20, "Username cannot exceed greater than 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, {
        error: "Username can only contain letter, number and underscore",
      }),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long."),
  });

  type Schema = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const submitLogin = async ({ username, password }: Schema) => {
    console.log(API_URL);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log(data.error);
      if (data.error) {
        setLoginErrors(data.error);
      }
      const { success } = data;
      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d11] flex items-center justify-center px-6 text-white">
      <main className="w-full max-w-75">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-10 h-10 rounded-[10px] bg-[#6858f5] flex items-center justify-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 11.5C20 15.09 16.42 18 12 18C10.87 18 9.8 17.8 8.84 17.44L5 19L6.08 15.76C5.4 14.58 5 13.19 5 11.5C5 7.91 8.58 5 12 5C16.42 5 20 7.91 20 11.5Z"
                stroke="white"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-[20px] leading-6 font-semibold tracking-[-0.3px]">
            Welcome back
          </h1>
          <p className="mt-1 text-[13px] text-[#9ca3b5]">
            Log in to keep the conversation going
          </p>
        </div>

        {loginErrors && (
          <p className="text-md border text-center border-red-600 text-red-600 py-1 my-3">
            {loginErrors}
          </p>
        )}
        <form className="space-y-3" onSubmit={handleSubmit(submitLogin)}>
          {/* Email */}
          <div>
            <label
              htmlFor="username"
              className="block mb-1.5 text-[13px] text-[#aeb4c4]"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              {...register("username")}
              placeholder="jane_10"
              className="
                w-full h-9 rounded-[7px]
                border border-[#292d36]
                bg-[#12151b]
                px-3
                text-[13px] text-white
                placeholder:text-[#657083]
                outline-none
                transition
                focus:border-[#6858f5]
                focus:ring-1 focus:ring-[#6858f5]
              "
            />
            {errors.username && <p>{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1.5 text-[13px] text-[#aeb4c4]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••••"
                className="
                  w-full h-9 rounded-[7px]
                  border border-[#292d36]
                  bg-[#12151b]
                  px-3 pr-10
                  text-[13px] text-white
                  placeholder:text-[#657083]
                  outline-none
                  transition
                  focus:border-[#6858f5]
                  focus:ring-1 focus:ring-[#6858f5]
                "
              />
              {errors.password && <p>{errors.password.message}</p>}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7788] hover:text-[#aeb4c4]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7a16 16 0 01-3.1 4.6" />
                    <path d="M6.2 6.2C4.4 7.5 3.2 9.3 2.5 12c1 2.5 4.5 7 9.5 7 1 0 1.9-.1 2.8-.4" />
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end -mt-0.5">
            <button
              type="button"
              className="text-[12px] text-[#7767ff] hover:text-[#8b7eff] transition"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full h-9.5
              rounded-[7px]
              bg-[#6858f5]
              hover:bg-[#7667ff]
              active:bg-[#5c4de3]
              text-[13px] font-semibold
              transition-colors
              mt-1
            "
          >
            Log in
          </button>
        </form>

        {/* Sign up */}
        <p className="text-center mt-5 text-[12px] text-[#a0a6b5]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-[#7767ff] hover:text-[#8b7eff] transition"
          >
            Sign up
          </button>
        </p>
      </main>
    </div>
  );
}
