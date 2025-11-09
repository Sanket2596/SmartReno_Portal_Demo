import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background/95 to-muted/50">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 rounded-[32px] border border-border/60 bg-background/90 p-8 shadow-xl shadow-primary/10 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            SmartReno Portal
          </span>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to your projects dashboard.
          </p>
        </div>
        <SignIn
          appearance={{
            layout: {
              logoPlacement: "none",
            },
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 focus:bg-primary/90 text-primary-foreground rounded-full h-11 text-sm font-semibold",
              card: "bg-transparent shadow-none border-none p-0",
              dividerLine: "bg-border/60",
            },
            variables: {
              colorPrimary: "#2563eb",
              borderRadius: "999px",
            },
          }}
          afterSignInUrl="/"
          redirectUrl="/"
        />
      </div>
    </div>
  );
}


