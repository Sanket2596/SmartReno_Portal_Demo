 "use client";

import * as React from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const variants = {
  initial: { rotate: -90, opacity: 0, scale: 0.8 },
  animate: { rotate: 0, opacity: 1, scale: 1 },
  exit: { rotate: 90, opacity: 0, scale: 0.8 },
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const handleToggle = React.useCallback(() => {
    if (!mounted) {
      return;
    }

    setTheme(isDark ? "light" : "dark");
  }, [isDark, mounted, setTheme]);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={`Activate ${isDark ? "light" : "dark"} mode`}
      onClick={handleToggle}
      className="relative h-10 w-10 overflow-hidden rounded-full border-[1.5px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          isDark ? (
            <motion.span
              key="moon"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <MoonStar className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <SunMedium className="h-5 w-5" />
            </motion.span>
          )
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <SunMedium className="h-5 w-5 opacity-0" />
          </span>
        )}
      </AnimatePresence>
    </Button>
  );
}

