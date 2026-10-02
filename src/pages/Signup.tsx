import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

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
          <h1 className="text-[19px] leading-6 font-semibold tracking-[-0.3px]">
            Create your account
          </h1>

          <p className="mt-1 text-[13px] text-[#9ca3b5]">
            Start messaging your team in minutes
          </p>
        </div>

        <form className="space-y-3">
          {/* Full name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-1.5 text-[13px] text-[#aeb4c4]"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Jane Cooper"
              className="
                w-full h-9
                rounded-[7px]
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
          </div>

          {/* Work email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1.5 text-[13px] text-[#aeb4c4]"
            >
              Work email
            </label>

            <input
              id="email"
              type="email"
              placeholder="jane@company.com"
              className="
                w-full h-9
                rounded-[7px]
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
                placeholder="••••••••••"
                className="
                  w-full h-9
                  rounded-[7px]
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

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-[#6f7788]
                  hover:text-[#aeb4c4]
                  transition
                "
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

          {/* Create account */}
          <button
            type="submit"
            className="
              w-full h-9.5
              rounded-[7px]
              bg-[#6858f5]
              hover:bg-[#7667ff]
              active:bg-[#5c4de3]
              text-[13px]
              font-semibold
              transition-colors
              mt-1 cursor-pointer
            "
          >
            Create account
          </button>
        </form>

        {/* Login */}
        <p className="text-center mt-5 text-[12px] text-[#a0a6b5]">
          Already have an account?{" "}
          <button
            type="button"
            className="
              text-[#7767ff]
              hover:text-[#8b7eff]
              transition 
            "
          >
            Log in
          </button>
        </p>
      </main>
    </div>
  );
}
