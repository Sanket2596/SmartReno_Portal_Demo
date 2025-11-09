 "use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_15%,rgba(59,130,246,0.2),transparent_60%)]" />
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(88,101,242,0.28),transparent_60%)]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.18),transparent_65%)]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.55, 0.8, 0.55], rotate: [0, -4, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.16),transparent_70%)]"
          animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45], rotate: [0, 6, 0] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 flex w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:flex-row sm:items-stretch"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="relative hidden min-h-full flex-[1.2] overflow-hidden sm:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.squarespace-cdn.com/content/v1/51d3f3a6e4b079b87b111fef/1404394359706-D2M1PN4B6QKYW7M0BKF0/For+Sale+Sign.jpg?format=1500w")',
            }}
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/80 via-slate-900/60 to-slate-900/70" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] backdrop-blur-lg">
                SmartReno
              </span>
              <h2 className="text-3xl font-semibold leading-tight text-white">
                Manage every renovation project with clarity and confidence.
              </h2>
              <p className="max-w-sm text-sm text-white/80">
                Keep bids, schedules, and homeowner updates all in one place. Sign in to
                resume where you left off and keep projects moving forward.
              </p>
            </div>
            <div className="space-y-2 text-sm text-white/75">
              <p className="font-semibold text-white">Why SmartReno?</p>
              <ul className="space-y-1">
                <li>• Centralize communication with your homeowners.</li>
                <li>• Track bids, site visits, and payments effortlessly.</li>
                <li>• Stay ahead with real-time project insights.</li>
              </ul>
            </div>
          </div>
        </div>

        <motion.div
          className="flex w-full min-h-full flex-1 shrink-0 flex-col gap-6 bg-white px-8 py-10 sm:min-w-[420px] sm:max-w-[460px] sm:px-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Welcome Back
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Sign in to SmartReno</h1>
            <p className="text-sm text-slate-500">
              Access your personalized dashboard and stay on top of every project update.
            </p>
          </div>

          <SignIn
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                formButtonPrimary:
                  "mt-2 h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold transition hover:bg-slate-800 focus:bg-slate-800",
                formFieldLabel: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500",
                formFieldInput:
                  "h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20",
                formFieldInputShowPasswordButton: "text-xs text-primary",
                footer: "hidden",
                socialButtonsBlockButton:
                  "h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:bg-primary/5",
                socialButtonsBlockButtonText: "text-sm font-medium text-slate-700",
                dividerRow: "my-4",
                dividerText: "text-xs uppercase tracking-[0.18em] text-slate-400",
                alert: "rounded-xl border border-rose-200 bg-rose-50 text-rose-600",
                form: "space-y-4",
                identityPreview: "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2",
                formField: "space-y-2",
                alternativeMethodsBlock: "space-y-3",
              },
              variables: {
                colorPrimary: "#2563eb",
                borderRadius: "16px",
                fontSize: "14px",
              },
            }}
            afterSignInUrl="/"
            redirectUrl="/"
          />

          <div className="space-y-1 text-center text-sm text-slate-500">
            <p>
              Don&apos;t have an account?{" "}
              <a
                href="/sign-up"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Register
              </a>
            </p>
            <p className="text-xs text-slate-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}


