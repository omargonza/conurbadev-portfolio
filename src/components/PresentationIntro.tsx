"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export default function PresentationIntro() {
  const shouldReduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem("hermit-intro-seen");
    if (!seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      sessionStorage.setItem("hermit-intro-seen", "true");
    }
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!show) return;

    const timer = window.setTimeout(() => {
      setShow(false);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [show]);

  const handleDismiss = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-[#07070A]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Background layers - integrated, no frames */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(900px 600px at 50% 50%, rgba(200,195,184,.10), transparent 65%),
                radial-gradient(1400px 900px at 50% 50%, rgba(242,239,231,.04), transparent 60%)
              `,
            }}
          />

          {/* Subtle noise texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2772%27 height=%2772%27 viewBox=%270 0 72 72%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%2772%27 height=%2772%27 filter=%27url(%23n)%27 opacity=%270.45%27/%3E%3C/svg%3E")',
            }}
          />

          {/* Content wrapper - centered, no visible container */}
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center">

              {/* Multi-layer halo behind isotipo */}
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(200,195,184,.18),transparent_70%)] blur-3xl" />
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(200,195,184,.10),transparent_70%)] blur-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.4, ease: EASE }}
              />
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(242,239,231,.08),transparent_70%)] blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
              />

              {/* Isotipo - large, no container, integrated with background */}
              <motion.div
                className="relative h-28 w-28 sm:h-40 sm:w-40"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
              >
                <Image
                  src="/brand/hermit-icon-dark.png"
                  alt="Hermit"
                  fill
                  sizes="160px"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Hermit text - using brand font, no PNG */}
              <motion.div
                className="mt-6 font-[family-name:var(--font-brand)] text-3xl tracking-[0.08em] text-[#F2EFE7] sm:mt-8 sm:text-5xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6, ease: EASE }}
              >
                Hermit
              </motion.div>

              {/* Tagline - text, no PNG */}
              <motion.div
                className="mt-4 text-center text-sm tracking-[0.12em] text-white/55 md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.2, ease: EASE }}
              >
                Software para operaciones reales.
              </motion.div>

              {/* Divider */}
              <motion.div
                className="mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[rgba(242,239,231,.18)] to-transparent"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.7, delay: 2.5, ease: EASE }}
              />
            </div>
          </div>

          {/* Omitir button */}
          <motion.button
            type="button"
            onClick={handleDismiss}
            className="absolute right-5 top-5 rounded-xl border border-[rgba(242,239,231,.12)] bg-white/[0.035] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/60 transition hover:border-[rgba(200,195,184,.28)] hover:bg-white/[0.07]"
            aria-label="Omitir introducción"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            Omitir
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
