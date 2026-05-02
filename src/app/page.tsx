"use client";


// React
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// Framer

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import PresentationIntro from "@/components/PresentationIntro";
import {
  Github,
  ExternalLink,
  Mail,
  Linkedin,
  ArrowUpRight,
  MapPin,
  Database,
  Code2,
  Layers,
  Wrench,
  ShieldCheck,
  Download,
  Factory,
} from "lucide-react";

/* =========================
   Identidad (Hermit)
========================= */
const BRAND = "Hermit";
const ROL = "Full Stack Developer · Sistemas para operación real";
const UBICACION = "Buenos Aires, AR · Remoto";

const EMAIL = "gonzamartinez1081@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/gonzalo-martinez-";
const GITHUB = "https://github.com/omargonza";

// 👇 Archivo dentro de /public
const CV_URL = "/cvgonza10.pdf";

/* =========================
   Tipos
========================= */
type GalleryItem = { src: string; alt: string; label: string };

type Project = {
  slug: "ot" | "yoquet" | "ingles";
  titulo: string;
  subtitulo: string;
  stack: string[];
  demo: string;
  repo: string;
  repo2?: string;
  puntos: string[];
  gallery: GalleryItem[];

  // “venderse” mejor (sin humo)
  rol: string;
  problema: string[];
  aporte: string[];
  resultado: string[];
  equipo: string[];
};

type SkillCard = {
  icon: LucideIcon;
  title: string;
  items: string[];
  note?: string;
};

/* =========================
   Helpers
========================= */
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function useMouseSpotlight<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    return () => el.removeEventListener("pointermove", onMove);
  }, [ref]);
}

/**
 * Spotlight premium: sigue el cursor + baja opacidad cuando salís.
 * Requiere CSS:
 * .fx-hero.spotlight-off .spotlight { opacity: .40; }
 * .fx-hero:not(.spotlight-off) .spotlight { opacity: .85; }
 */
function useHeroSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty("--mx", "45%");
    el.style.setProperty("--my", "18%");
    el.classList.add("spotlight-off");

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    const onEnter = () => el.classList.remove("spotlight-off");
    const onLeave = () => el.classList.add("spotlight-off");

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}

type MagneticButtonProps = {
  className: string;
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

function MagneticButton({
  className,
  children,
  href,
  target,
  rel,
  onClick,
  ariaLabel,
}: MagneticButtonProps) {
  const refA = useRef<HTMLAnchorElement | null>(null);
  const refB = useRef<HTMLButtonElement | null>(null);

  const [xy, setXy] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = (href ? refA.current : refB.current) as HTMLElement | null;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      setXy({ x: clamp(dx * 0.1, -10, 10), y: clamp(dy * 0.1, -10, 10) });
    };

    const onLeave = () => setXy({ x: 0, y: 0 });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [href]);

  const motionStyle = {
    translateX: xy.x,
    translateY: xy.y,
  } as React.CSSProperties;
  const motionTransition = {
    type: "spring" as const,
    stiffness: 380,
    damping: 26,
  };

  if (href) {
    return (
      <motion.a
        ref={refA}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
        className={className}
        style={motionStyle}
        transition={motionTransition}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={refB}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
      style={motionStyle}
      transition={motionTransition}
    >
      {children}
    </motion.button>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto mt-12 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
}

/* =========================
   Labels / bullets para “case studies”
========================= */
const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] uppercase tracking-widest text-white/45">
    {children}
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-2">
    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(200,195,184,.95)]" />
    <span>{children}</span>
  </li>
);

function SkillGroup({ icon: Icon, title, items, note }: SkillCard) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[rgba(242,239,231,0.12)] bg-[#111116] p-5 shadow-[0_24px_80px_rgba(0,0,0,.65)] ring-1 ring-[rgba(242,239,231,0.06)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[rgba(200,195,184,.14)] blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
              <Icon className="h-4 w-4 text-white/45" />
              {title}
            </div>
            {note ? (
              <div className="mt-2 text-xs text-white/55">{note}</div>
            ) : null}
          </div>
          <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04]" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Lightbox (capturas pro)
========================= */
function Lightbox({
  item,
  onClose,
}: {
  item: { src: string; alt: string; label: string } | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/12 bg-[#0b0b10] shadow-[0_30px_120px_rgba(0,0,0,.75)]"
        initial={{ y: 18, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-semibold text-white/85">
            {item.label}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/75 hover:bg-white/[0.06]"
          >
            Cerrar
          </button>
        </div>

        <div className="relative aspect-[4/3] w-full bg-black">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-contain"
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================
   Gallery con spotlight + click
========================= */
/* =========================
   Gallery premium showcase
========================= */
function Gallery({
  items,
  brandAccent = true,
  onOpen,
}: {
  items: GalleryItem[];
  brandAccent?: boolean;
  onOpen?: (x: GalleryItem) => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useMouseSpotlight(wrapRef);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-2xl border border-[rgba(242,239,231,.10)] bg-[#08080B] p-3 shadow-[inset_0_1px_0_rgba(242,239,231,.06)] ring-1 ring-inset ring-[rgba(200,195,184,.06)]"
      style={{
        backgroundImage: `
          radial-gradient(720px 280px at var(--mx, 50%) var(--my, 20%),
            rgba(200,195,184,.10),
            transparent 62%),
          linear-gradient(180deg, rgba(242,239,231,.035), rgba(0,0,0,.08))
        `,
      }}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/48">
          Capturas
        </div>
        <div className="text-[10px] uppercase tracking-[0.14em] text-white/35">
          mobile · tablet · web
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((x) => (
          <motion.button
            key={x.src}
            type="button"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="group relative overflow-hidden rounded-xl border border-[rgba(242,239,231,.08)] bg-[#0B0B0F] text-left shadow-[0_14px_34px_rgba(0,0,0,.38)] ring-1 ring-inset ring-[rgba(200,195,184,.045)] transition hover:border-[rgba(200,195,184,.22)] hover:shadow-[0_20px_48px_rgba(0,0,0,.55)]"
            onClick={() => onOpen?.(x)}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: brandAccent
                  ? `radial-gradient(520px 220px at 50% 0%, rgba(200,195,184,.13), transparent 64%)`
                  : "",
              }}
            />

            <div className="relative h-48 w-full overflow-hidden bg-black sm:h-52 md:h-56 lg:h-48">
              <Image
                src={x.src}
                alt={x.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-[1.018]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(0,0,0,.42))]" />
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[rgba(242,239,231,.08)] bg-black/45 px-3 py-2 text-xs">
              <span className="max-w-[70%] truncate text-white/70">
                {x.label}
              </span>

              <span className="inline-flex items-center gap-2 text-white/40">
                <span className="h-1 w-1 rounded-full bg-[rgba(200,195,184,.75)]" />
                <span className="font-[family-name:var(--font-brand)] tracking-[0.06em]">
                  Hermit
                </span>
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
const PROJECT_TABS = [
  {
    key: "ot",
    label: "OT",
    title: "OT-ELÉCTRICOS",
    desc: "Sistema operativo para campo",
    img: "/projects/ot/01-dashboard.jpg",
    bullets: ["Trazabilidad + historial", "PDFs listos auditoría"],
    href: "https://ot-frontend-pro.onrender.com",
    repo: "https://github.com/omargonza/sistema-mantenimiento-electrico.git",
    accent: "rgba(200,195,184,.18)",
  },
  {
    key: "yoquet",
    label: "E-commerce",
    title: "Yoquet Diseños",
    desc: "Catálogo + carrito + deploy",
    img: "/projects/yoquet/01-hero.jpg",
    bullets: ["UX clara + estados", "Arquitectura front/back"],
    href: "https://yoquet-disenos-frontend.onrender.com",
    repo: "https://github.com/omargonza/yoquet_disenos_frontend.git",
    accent: "rgba(255,255,255,.10)",
  },
  {
    key: "landing",
    label: "Landing",
    title: "Curso online",
    desc: "Captación rápida y simple",
    img: "/projects/ingles/01-hero.jpg",
    bullets: ["Responsive real", "CTA + performance/SEO"],
    href: "https://omargonza.github.io/online/",
    repo: "https://github.com/omargonza/online.git",
    accent: "rgba(142,138,131,.12)",
  },
] as const;

type TabKey = (typeof PROJECT_TABS)[number]["key"];

function ProjectTabsPreview() {
  const shouldReduceMotion = useReducedMotion();

  const TABS = PROJECT_TABS;
  const keys = useMemo(() => TABS.map((t) => t.key) as TabKey[], [TABS]);

  const [active, setActive] = useState<TabKey>(TABS[0].key);
  const [paused, setPaused] = useState(false);

  const current = useMemo(
    () => TABS.find((t) => t.key === active) ?? TABS[0],
    [TABS, active],
  );
  const idx = useMemo(() => TABS.findIndex((t) => t.key === active), [TABS, active]);

  const goNext = useCallback(() => {
    setActive((prev) => {
      const i = keys.indexOf(prev);
      return keys[(i + 1) % keys.length];
    });
  }, [keys]);

  const goPrev = useCallback(() => {
    setActive((prev) => {
      const i = keys.indexOf(prev);
      return keys[(i - 1 + keys.length) % keys.length];
    });
  }, [keys]);

  // autoplay (se desactiva si reduce motion)
  useEffect(() => {
    if (paused || shouldReduceMotion) return;

    const id = window.setInterval(() => {
      setActive((prev) => {
        const i = keys.indexOf(prev);
        return keys[(i + 1) % keys.length];
      });
    }, 4500);

    return () => window.clearInterval(id);
  }, [paused, shouldReduceMotion, keys]);

  // pill animada (simple y estable)
  const pillW = 92;
  const pillX = idx * (pillW + 8);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_55px_rgba(0,0,0,.55)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* accent backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage: `radial-gradient(650px 260px at 40% 0%, ${current.accent}, transparent 60%)`,
        }}
      />

      {/* header */}
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/50">
            Preview real
          </div>
          <div className="mt-1 text-sm font-semibold text-white/90">
            {current.title}
          </div>
          <div className="mt-1 text-xs text-white/55">{current.desc}</div>
        </div>

        <div className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] uppercase tracking-widest text-white/55">
          {paused || shouldReduceMotion ? "pause" : "auto"}
        </div>
      </div>

      {/* tabs */}
      <div className="relative mt-3">
        <div
          role="tablist"
          aria-label="Proyectos"
          className="relative inline-flex gap-2 rounded-full border border-white/10 bg-black/20 p-1"
        >
          <motion.div
            aria-hidden
            className="absolute left-1 top-1 h-[30px] rounded-full border border-white/12 bg-white/[0.08]"
            animate={{ x: pillX, width: pillW }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          />

          {TABS.map((t) => {
            const isOn = t.key === active;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isOn}
                type="button"
                onClick={() => setActive(t.key)}
                className={[
                  "relative z-10 h-[30px] w-[92px] rounded-full text-xs transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(200,195,184,0.7)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
                  isOn ? "text-white/90" : "text-white/60 hover:text-white/80",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* panel */}
      <motion.div
        key={current.key}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative mt-3"
      >
        {/* swipe area */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_, info) => {
            const offset = info.offset.x;
            const velocity = info.velocity.x;

            const SWIPE_OFFSET = 70;
            const SWIPE_VELOCITY = 500;

            if (offset < -SWIPE_OFFSET || velocity < -SWIPE_VELOCITY) goNext();
            else if (offset > SWIPE_OFFSET || velocity > SWIPE_VELOCITY) goPrev();

            window.setTimeout(() => setPaused(false), 250);
          }}
          className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-black/30"
          style={{ touchAction: "pan-y" }}
          whileTap={{ cursor: "grabbing" }}
        >
          <Image
            src={current.img}
            alt={`Preview ${current.title}`}
            fill
            sizes="(max-width: 1024px) 100vw, 420px"
            className="object-cover"
            priority={active === "ot"}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[10px] text-white/70 backdrop-blur">
            {current.label}
          </div>

          {!shouldReduceMotion ? (
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[10px] text-white/60 backdrop-blur">
              Deslizá ◀ ▶
            </div>
          ) : null}
        </motion.div>

        {/* bullets */}
        <ul className="mt-3 space-y-2 text-xs text-white/65">
          {current.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(200,195,184,.95)]" />
              {b}
            </li>
          ))}
        </ul>

        {/* actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={current.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <ExternalLink className="h-4 w-4" />
            Ver demo <ArrowUpRight className="h-4 w-4 opacity-60" />
          </a>

          <a
            href={current.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <Github className="h-4 w-4" />
            Repo <ArrowUpRight className="h-4 w-4 opacity-60" />
          </a>
        </div>
      </motion.div>

      {/* progress bar */}
      <div className="relative mt-4 h-[2px] overflow-hidden rounded-full bg-white/10">
        <motion.i
          className="block h-full bg-[rgba(200,195,184,.85)]"
          key={String(active) + String(paused) + String(shouldReduceMotion)}
          initial={{ width: "0%" }}
          animate={{ width: paused || shouldReduceMotion ? "35%" : "100%" }}
          transition={{ duration: paused || shouldReduceMotion ? 0.2 : 4.5, ease: "linear" }}
        />
      </div>
    </div>
  );
}

/* =========================
   Página
========================= */
export default function Page() {
  const heroRef = useHeroSpotlight<HTMLDivElement>();
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`[Portfolio] ${BRAND}`)}`;

  const skills: SkillCard[] = useMemo(
    () => [
      {
        icon: Database,
        title: "Datos y bases de datos",
        items: [
          "SQL Server",
          "MySQL",
          "PostgreSQL (pgAdmin)",
          "MongoDB",
          "Mongo Atlas",
          "Modelado de datos",
        ],
        note: "Modelado, consultas, administración y criterio para datos consistentes.",
      },
      {
        icon: Code2,
        title: "Backend",
        items: [
          "Python",
          "Node.js",
          "Express",
          "APIs REST",
          "Autenticación",
          "Validaciones",
        ],
        note: "Construcción de servicios, endpoints claros y validación de payloads.",
      },
      {
        icon: Layers,
        title: "Frontend",
        items: [
          "JavaScript",
          "React",
          "Vite",
          "HTML5",
          "CSS",
          "DOM",
          "Tailwind CSS",
          "Bootstrap",
          "Responsive",
        ],
        note: "UI funcional y responsive, orientada a uso real.",
      },
      {
        icon: Wrench,
        title: "Herramientas",
        items: [
          "Git/GitHub",
          "Control de versiones",
          "VS Code",
          "Consolas",
          "Colab Notebooks",
          "Firebase",
        ],
        note: "Trabajo con PRs, revisiones y flujo ordenado de cambios.",
      },
    ],
    [],
  );

  const industrialLeft = useMemo(
    () => [
      "Mantenimiento eléctrico BT (220/380), iluminación y tableros de comando/potencia.",
      "Diagnóstico y resolución de fallas (comando/potencia y tendidos).",
      "Trabajo con normas de seguridad, procedimientos y tareas críticas.",
      "Experiencia en entornos productivos: logística, inventario, trazabilidad y documentación.",
      "Preventivo/correctivo en líneas y paradas anuales (criterio de disponibilidad).",
    ],
    [],
  );

  const industrialRight = useMemo(
    () => [
      "Diseño sistemas pensando en operación: trazabilidad, historial y datos consistentes.",
      "Validaciones y formatos claros para evitar “carga sucia” y retrabajo.",
      "Entregas cortas con checklist de prueba y foco en estabilidad.",
      "Comunicación simple con perfiles mixtos (operación, mantenimiento e IT).",
    ],
    [],
  );

  const projects: Project[] = useMemo(
    () => [
      {
        slug: "ot",
        titulo: "OT-ELÉCTRICOS — Sistema de Mantenimiento (Producción)",
        subtitulo:
          "OTs, historial, tableros/luminarias, evidencias y PDF operativo",
        stack: ["Django/DRF", "React", "PostgreSQL", "PDF", "Offline"],
        demo: "https://ot-frontend-pro.onrender.com",
        repo: "https://github.com/omargonza/sistema-mantenimiento-electrico.git",
        puntos: [
          "Normalización/validación para consistencia de datos operativos",
          "Reportes técnicos en PDF y flujo de trabajo ordenado",
          "Uso pensado para campo (evidencias, historial, trazabilidad)",
        ],
        gallery: [
          {
            src: "/projects/ot/01-dashboard.jpg",
            alt: "Centro de control OT",
            label: "Centro de control",
          },
          {
            src: "/projects/ot/02-nueva-ot.jpg",
            alt: "Nueva OT",
            label: "Nueva OT",
          },
          {
            src: "/projects/ot/03-historial.jpg",
            alt: "Historial",
            label: "Historial",
          },
          { src: "/projects/ot/04-pdfs.jpg", alt: "PDFs", label: "Mis PDFs" },
        ],

        rol: "Desarrollo end-to-end (API + validaciones + PDF + UX).",
        problema: [
          "Carga operativa en campo con riesgo de datos inconsistentes.",
          "Necesidad de reportes técnicos (PDF) listos para auditoría y seguimiento.",
        ],
        aporte: [
          "Diseño de endpoints y normalización de payloads para evitar duplicados y formatos inválidos.",
          "Generación de PDFs operativos y persistencia offline para uso en campo.",
          "Criterios de validación para que el dato llegue consistente a producción.",
        ],
        resultado: [
          "Menos retrabajo por errores de carga y mayor trazabilidad.",
          "Historial + evidencias + reportes centralizados en un flujo claro.",
        ],
        equipo: [
          "Trabajo por entregas cortas (issues/PRs) con checklist de prueba.",
          "Comunicación simple: qué cambia, qué se prueba y qué se despliega.",
        ],
      },
      {
        slug: "yoquet",
        titulo: "Yoquet Diseños — E-commerce (Producción)",
        subtitulo: "Catálogo, carrito, flujo de compra y despliegue",
        stack: ["Backend", "Frontend", "Deploy"],
        demo: "https://yoquet-disenos-frontend.onrender.com",
        repo: "https://github.com/omargonza/yoquet_disenos_backend.git",
        repo2: "https://github.com/omargonza/yoquet_disenos_frontend.git",
        puntos: [
          "Arquitectura separada backend/frontend",
          "Experiencia de compra completa",
          "Demo pública en producción",
        ],
        gallery: [
          {
            src: "/projects/yoquet/01-hero.jpg",
            alt: "Inicio Yoquet",
            label: "Inicio",
          },
          {
            src: "/projects/yoquet/02-catalogo.jpg",
            alt: "Catálogo",
            label: "Catálogo",
          },
          {
            src: "/projects/yoquet/03-filtrado.jpg",
            alt: "Filtrado",
            label: "Filtrado",
          },
          {
            src: "/projects/yoquet/04-carrito.jpg",
            alt: "Carrito",
            label: "Carrito",
          },
        ],

        rol: "Backend + Front (arquitectura separada) y despliegue.",
        problema: [
          "Necesidad de e-commerce liviano y estable, con UX consistente.",
          "Separar responsabilidades para escalar sin acoplar todo.",
        ],
        aporte: [
          "Separación backend/frontend en repos dedicados y flujos claros.",
          "Navegación, catálogo y estados vacíos para una UX ordenada.",
        ],
        resultado: [
          "Demo pública estable en producción.",
          "Código mantenible: cambios por módulo y menor fricción al iterar.",
        ],
        equipo: [
          "Entrega por hitos + feedback rápido.",
          "Me adapto a estándares del equipo (naming, PRs, revisiones).",
        ],
      },
      {
        slug: "ingles",
        titulo: "Landing — Curso online (Deploy)",
        subtitulo: "Landing responsive lista para captación",
        stack: ["React", "Vite", "Responsive", "Deploy"],
        demo: "https://omargonza.github.io/online/",
        repo: "https://github.com/omargonza/online.git",
        puntos: [
          "Responsive real",
          "Jerarquía visual clara",
          "Deploy simple y estable",
        ],
        gallery: [
          { src: "/projects/ingles/01-hero.jpg", alt: "Hero", label: "Hero" },
          {
            src: "/projects/ingles/02-sobre.jpg",
            alt: "Sobre",
            label: "Sobre",
          },
          {
            src: "/projects/ingles/03-objetivo.jpg",
            alt: "Objetivo",
            label: "Objetivo",
          },
          { src: "/projects/ingles/04-cta.jpg", alt: "CTAs", label: "CTAs" },
        ],

        rol: "Landing responsive + estructura lista para crecer.",
        problema: [
          "Landing que convierta sin ser pesada ni confusa.",
          "Ordenar propuesta y CTAs con jerarquía visual.",
        ],
        aporte: [
          "Jerarquía visual, secciones claras y CTAs visibles.",
          "Mobile-first con legibilidad real.",
        ],
        resultado: ["Página clara para captación.", "Deploy simple y estable."],
        equipo: [
          "Si hay diseñador/copy, lo integro sin fricción.",
          "Itero rápido hasta que cierre visualmente y en performance.",
        ],
      },
    ],
    [],
  );

  // Lightbox
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  // Parallax sutil de fondo (premium, no mareo)
  const scrollY = useMotionValue(0);
  const bgY = useTransform(scrollY, [0, 1200], [0, -90]);
  const bgYSpring = useSpring(bgY, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollY]);

   return (
     <div className="min-h-screen bg-[#07070a] text-white">
       <PresentationIntro />
       {/* Fondo industrial: glow + grano */}
       <div className="bg-ambient" />
       <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ y: bgYSpring }}
      >
        <div
          className="absolute inset-0 opacity-[0.95]"
          style={{
            backgroundImage: `
              radial-gradient(1100px 500px at 20% 0%, rgba(200,195,184,.22), transparent 60%),
              radial-gradient(900px 420px at 80% 10%, rgba(255,255,255,.06), transparent 60%),
              radial-gradient(1200px 600px at 50% 110%, rgba(142,138,131,.12), transparent 55%),
              linear-gradient(180deg, rgba(0,0,0,.0), rgba(0,0,0,.55) 40%, rgba(0,0,0,.85))
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2772%27 height=%2772%27 viewBox=%270 0 72 72%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%2772%27 height=%2772%27 filter=%27url(%23n)%27 opacity=%270.45%27/%3E%3C/svg%3E")',
          }}
        />
      </motion.div>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/35 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
           <Link
              href="/"
              aria-label="Volver al inicio"
              className="group flex items-center gap-3 rounded-xl outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[rgba(200,195,184,0.8)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
            >
              <div className="leading-tight">
                <div className="font-[family-name:var(--font-brand)] text-[18px] font-semibold tracking-[0.10em] text-[#F2EFE7] md:text-[20px]">
                  HERMIT
                </div>
                <div className="mt-0.5 text-xs text-white/55 md:text-[13px]">
                  Full Stack Developer · Sistemas para operación real
                </div>
              </div>
            </Link>

          <div className="flex items-center gap-2">
            <MagneticButton
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              ariaLabel="Abrir GitHub"
            >
              <Github className="h-4 w-4" />
              GitHub <ArrowUpRight className="h-4 w-4 opacity-60" />
            </MagneticButton>

            <MagneticButton
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              ariaLabel="Abrir LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn <ArrowUpRight className="h-4 w-4 opacity-60" />
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate="show"
            variants={container}
            className="fx-hero relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,.55)] sm:p-8 md:p-10"
          >
            {/* spotlight follow */}
            <div className="spotlight" />

            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06]" />
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[rgba(200,195,184,.22)] blur-3xl" />
            <div className="pointer-events-none absolute -right-28 top-16 h-72 w-72 rounded-full bg-white/[0.07] blur-3xl" />

            <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
              <div>
                <motion.div
                  variants={item}
                  className="inline-flex flex-wrap items-center gap-2"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70">
                    <MapPin className="h-3.5 w-3.5" />
                    {UBICACION}
                  </span>
                </motion.div>
                <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl font-[family-name:var(--font-brand)] tracking-[0.06em]">
                <span className="font-[family-name:var(--font-brand)] tracking-[0.06em]">Hermit</span>
                </h1>
                <div className="mt-2 text-xl text-white/80 sm:text-2xl">
                  Sistemas operativos para procesos reales.
                </div>
                <div className="mt-1 text-sm text-white/50">
                  Full Stack Developer
                </div>
                <motion.p
                  variants={item}
                  className="mt-4 max-w-2xl text-[15px] leading-7 text-white/72"
                >
                   Desarrollo software para mantenimiento, trazabilidad y operaciones.
                   También e-commerce y landing pages pensadas para uso real.
                </motion.p>
                <motion.div
                  variants={item}
                  className="mt-7 grid gap-3 sm:grid-cols-2"
                >
                  <MagneticButton
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8C3B8] px-4 py-3 text-sm font-semibold text-[#07070A] shadow-[0_18px_50px_rgba(200,195,184,.20)] ring-1 ring-[rgba(242,239,231,.18)] transition hover:shadow-[0_22px_65px_rgba(200,195,184,.28)] hover:-translate-y-0.5 active:translate-y-0"
                    href={mailto}
                    ariaLabel="Contactar por email"
                  >
                    <Mail className="h-4 w-4" />
                    Contacto
                    <ArrowUpRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </MagneticButton>

                  <button
                    type="button"
                    onClick={() => document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(242,239,231,.14)] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#F2EFE7] transition hover:border-[rgba(242,239,231,.24)] hover:bg-white/[0.08]"
                    aria-label="Ver proyectos"
                  >
                    Ver proyectos
                    <ArrowUpRight className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </motion.div>
                <motion.div
                  variants={item}
                  className="mt-5 flex flex-wrap gap-2"
                >
                  {[
                    "Python",
                    "Django",
                    "React",
                    "PostgreSQL",
                    "APIs",
                    "Deploy",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </motion.div>
                <motion.div
                  variants={item}
                  className="mt-6 grid gap-3 sm:grid-cols-3"
                >
                  {/* Sistemas operativos */}
                  <div className="relative overflow-hidden rounded-2xl border border-[rgba(242,239,231,0.12)] bg-[#111116] p-4 shadow-[0_18px_55px_rgba(0,0,0,.55)] ring-1 ring-[rgba(242,239,231,0.04)]">
                    {/* Emergence glow */}
                    <div className="pointer-events-none absolute -bottom-10 left-1/2 h-10 w-[30%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,195,184,.18),rgba(200,195,184,.07)_30%,transparent_70%)] blur-2xl opacity-40 transition-all duration-500 ease-out group-hover:w-[58%] group-hover:opacity-70" />
                    <div className="text-xs uppercase tracking-widest text-white/55">
                      Sistemas operativos
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white/90">
                      Mantenimiento, historial, evidencias y reportes.
                    </div>
                    <div className="mt-2 text-xs leading-5 text-white/65">
                      Trazabilidad, historial por activo, fotos y reportes
                      listos para auditoría y seguimiento.
                    </div>
                    <div className="mt-3 h-[2px] w-10 rounded-full bg-[rgba(200,195,184,.95)]" />
                  </div>

                   {/* E-commerce */}
                   <div className="group relative overflow-hidden rounded-2xl border border-[rgba(242,239,231,0.12)] bg-[#111116] p-4 shadow-[0_18px_55px_rgba(0,0,0,.55)] ring-1 ring-[rgba(242,239,231,.04)]">
                     <div className="pointer-events-none absolute -bottom-10 left-1/2 h-10 w-[30%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,195,184,.18),rgba(200,195,184,.07)_30%,transparent_70%)] blur-2xl opacity-40 transition-all duration-500 ease-out group-hover:w-[58%] group-hover:opacity-70" />
                     <div className="text-xs uppercase tracking-widest text-white/55">
                      E-commerce
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white/90">
                      Catálogos, carrito y experiencia de compra.
                    </div>
                    <div className="mt-2 text-xs leading-5 text-white/65">
                      Tienda online: catálogo, filtros, carrito,
                      estados vacíos y publicación.
                    </div>
                    <div className="mt-3 h-[2px] w-10 rounded-full bg-[rgba(200,195,184,.95)]" />
                  </div>

                   {/* Landing pages */}
                   <div className="group relative overflow-hidden rounded-2xl border border-[rgba(242,239,231,0.12)] bg-[#111116] p-4 shadow-[0_18px_55px_rgba(0,0,0,.55)] ring-1 ring-[rgba(242,239,231,.04)]">
                     <div className="pointer-events-none absolute -bottom-10 left-1/2 h-10 w-[30%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,195,184,.18),rgba(200,195,184,.07)_30%,transparent_70%)] blur-2xl opacity-40 transition-all duration-500 ease-out group-hover:w-[58%] group-hover:opacity-70" />
                     <div className="text-xs uppercase tracking-widest text-white/55">
                      Landing pages
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white/90">
                      Sitios claros, rápidos y orientados a conversión.
                    </div>
                    <div className="mt-2 text-xs leading-5 text-white/65">
                      Landing responsive con jerarquía visual, CTAs,
                      performance y SEO básico.
                    </div>
                    <div className="mt-3 h-[2px] w-10 rounded-full bg-[rgba(200,195,184,.95)]" />
                  </div>
                </motion.div>
                <motion.div
                  variants={item}
                  className="mt-4 text-xs text-white/55"
                >
                  Trabajo por entregas cortas: alcance claro, checklist de
                  prueba, deploy y handoff.
                </motion.div>
              </div>

              <motion.div
                variants={item}
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
              >
                <ProjectTabsPreview />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <SectionDivider />

      {/* STACK REAL */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-90px" }}
            variants={container}
          >
            <motion.div variants={item}>
              <div className="text-xs uppercase tracking-widest text-white/50">
                Stack real
              </div>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Tecnologías que uso en proyectos
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-white/70">
                Agrupado por áreas...
              </p>
            </motion.div>

            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              {skills.map((s) => (
                <motion.div key={s.title} variants={item}>
                  <SkillGroup {...s} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* PLUS INDUSTRIAL */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-90px" }}
            variants={container}
          >
            <motion.div variants={item}>
              <div className="text-xs uppercase tracking-widest text-white/50">
                Plus industrial
              </div>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Experiencia operativa real
              </h2>
              <p className="mt-2 max-w-3xl text-[15px] leading-7 text-white/70">
                Esto aporta criterio para diseñar software que se usa en campo:
                trazabilidad, validaciones y procesos claros.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-7 grid gap-6 lg:grid-cols-2"
            >
              <div className="relative overflow-hidden rounded-3xl border border-[rgba(242,239,231,0.12)] bg-[#111116] p-5 shadow-[0_24px_80px_rgba(0,0,0,.65)] ring-1 ring-[rgba(242,239,231,0.06)]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
                  <Factory className="h-4 w-4 text-white/45" />
                  Experiencia operativa
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/72">
                  {industrialLeft.map((x) => (
                    <Bullet key={x}>{x}</Bullet>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,.55)]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
                  <ShieldCheck className="h-4 w-4 text-white/45" />
                  Cómo se traduce a software
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/72">
                  {industrialRight.map((x) => (
                    <Bullet key={x}>{x}</Bullet>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* PROYECTOS */}
      <section id="proyectos" className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-90px" }}
            variants={container}
          >
            <motion.div variants={item}>
              <div className="text-xs uppercase tracking-widest text-white/50">
                Proyectos
              </div>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Casos reales (qué hice y qué resolví)
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-white/70">
                Además de tecnologías, muestro el aporte concreto: problema,
                decisiones y resultado.
              </p>
            </motion.div>

             <div className="mt-7 grid gap-8 lg:grid-cols-3">
  {projects.map((p) => (
    <motion.article
      key={p.titulo}
      variants={item}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="group relative overflow-visible rounded-3xl transition-all duration-500"
      style={{ transformOrigin: "bottom center" }}
    >
      {/* Deep structural shadow */}
      <div className="pointer-events-none absolute -bottom-10 left-1/2 z-0 h-16 w-[72%] -translate-x-1/2 rounded-full bg-black/80 blur-3xl opacity-75 transition-all duration-500 ease-out group-hover:h-24 group-hover:w-[104%] group-hover:opacity-95" />

      {/* Metallic emergence base */}
      <div className="pointer-events-none absolute -bottom-7 left-1/2 z-0 h-12 w-[42%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,195,184,.34),rgba(200,195,184,.14)_34%,rgba(200,195,184,.04)_52%,transparent_76%)] blur-2xl opacity-75 transition-all duration-500 ease-out group-hover:h-20 group-hover:w-[92%] group-hover:opacity-100 group-hover:blur-3xl" />

      {/* Inner card */}
      <div className="relative z-10 overflow-hidden rounded-3xl border border-[rgba(242,239,231,.15)] bg-[linear-gradient(180deg,rgba(242,239,231,.055),rgba(17,17,22,.96)_18%,#111116_100%)] p-5 shadow-[0_32px_110px_rgba(0,0,0,.78),inset_0_1px_0_rgba(242,239,231,.09)] ring-1 ring-[rgba(242,239,231,.06)] transition-all duration-500 group-hover:border-[rgba(200,195,184,.36)] group-hover:shadow-[0_44px_140px_rgba(0,0,0,.92),inset_0_1px_0_rgba(242,239,231,.13)]">
        {/* Top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(242,239,231,.22)] to-transparent" />

        {/* Internal depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_340px_at_50%_-12%,rgba(242,239,231,.095),transparent_62%)] opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Ambient internal glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.055] blur-3xl" />
          <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[rgba(200,195,184,.15)] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-[rgba(200,195,184,.045)] blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-semibold text-white/95">
                {p.titulo}
              </div>
              <div className="mt-1 text-xs text-white/60">
                {p.subtitulo}
              </div>
            </div>

            <div className="h-10 w-10 rounded-2xl border border-[rgba(242,239,231,.12)] bg-white/[0.04] shadow-[inset_0_1px_0_rgba(242,239,231,.08)]" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-[rgba(242,239,231,.11)] bg-black/30 px-3 py-1 text-xs text-white/70"
              >
                {s}
              </span>
            ))}
          </div>

          <ul className="mt-4 space-y-2 text-sm text-white/72">
            {p.puntos.map((b) => (
              <Bullet key={b}>{b}</Bullet>
            ))}
          </ul>

          {/* Bloque: rol / problema / aporte / resultado / equipo */}
          <div className="mt-5 grid gap-4 rounded-2xl border border-[rgba(242,239,231,.11)] bg-[#0B0B0F]/80 p-4 shadow-[inset_0_1px_0_rgba(242,239,231,.06)]">
            <div>
              <Label>Mi rol</Label>
              <div className="mt-1 text-sm text-white/85">{p.rol}</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Problema</Label>
                <ul className="mt-2 space-y-2 text-sm text-white/72">
                  {p.problema.map((x) => (
                    <Bullet key={x}>{x}</Bullet>
                  ))}
                </ul>
              </div>

              <div>
                <Label>Lo que hice</Label>
                <ul className="mt-2 space-y-2 text-sm text-white/72">
                  {p.aporte.map((x) => (
                    <Bullet key={x}>{x}</Bullet>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Resultado</Label>
                <ul className="mt-2 space-y-2 text-sm text-white/72">
                  {p.resultado.map((x) => (
                    <Bullet key={x}>{x}</Bullet>
                  ))}
                </ul>
              </div>

              <div>
                <Label>Trabajo en equipo</Label>
                <ul className="mt-2 space-y-2 text-sm text-white/72">
                  {p.equipo.map((x) => (
                    <Bullet key={x}>{x}</Bullet>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <MagneticButton
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(242,239,231,.12)] bg-white/[0.045] px-3 py-2 text-sm text-white/85 transition hover:border-[rgba(200,195,184,.28)] hover:bg-white/[0.075]"
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              ariaLabel="Abrir demo"
            >
              <ExternalLink className="h-4 w-4" />
              Ver demo <ArrowUpRight className="h-4 w-4 opacity-60" />
            </MagneticButton>

            <MagneticButton
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(242,239,231,.12)] bg-white/[0.045] px-3 py-2 text-sm text-white/85 transition hover:border-[rgba(200,195,184,.28)] hover:bg-white/[0.075]"
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              ariaLabel="Abrir repo"
            >
              <Github className="h-4 w-4" />
              Repo <ArrowUpRight className="h-4 w-4 opacity-60" />
            </MagneticButton>

            {p.repo2 ? (
              <MagneticButton
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(242,239,231,.12)] bg-white/[0.045] px-3 py-2 text-sm text-white/85 transition hover:border-[rgba(200,195,184,.28)] hover:bg-white/[0.075]"
                href={p.repo2}
                target="_blank"
                rel="noreferrer"
                ariaLabel="Abrir repo frontend"
              >
                <Github className="h-4 w-4" />
                Repo front{" "}
                <ArrowUpRight className="h-4 w-4 opacity-60" />
              </MagneticButton>
            ) : null}
          </div>

          <div className="mt-5 rounded-2xl border border-[rgba(242,239,231,.12)] bg-[#0B0B0F]/80 p-2 shadow-[0_18px_45px_rgba(0,0,0,.45)] ring-1 ring-inset ring-[rgba(200,195,184,.08)]">
            <Gallery items={p.gallery} onOpen={setLightbox} />
          </div>
        </div>
      </div>
    </motion.article>
  ))}
</div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* CONTACTO */}
      <section className="px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-90px" }}
            variants={container}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,.55)] sm:p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -left-28 -bottom-28 h-80 w-80 rounded-full bg-[rgba(200,195,184,.18)] blur-3xl" />
            <div className="pointer-events-none absolute -right-28 top-12 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />

            <motion.div
              variants={item}
              className="text-xs uppercase tracking-widest text-white/50"
            >
              Contacto
            </motion.div>
            <motion.h2
              variants={item}
              className="mt-2 text-2xl font-semibold sm:text-3xl"
            >
              Charlémoslo
            </motion.h2>
            <motion.p
              variants={item}
              className="mt-2 max-w-2xl text-[15px] leading-7 text-white/70"
            >
              Si te interesa mi perfil, coordinamos una entrevista y lo
              aterrizamos en tareas concretas: alcance, entregables y forma de
              trabajo (PRs, revisiones y entregas cortas).
            </motion.p>

            <motion.div
              variants={item}
              className="mt-6 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap"
            >
              <MagneticButton
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C8C3B8] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(200,195,184,.25)] transition hover:brightness-110 active:brightness-95"
                href={mailto}
                ariaLabel="Enviar email"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
                <ArrowUpRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>

              <MagneticButton
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(242,239,231,.14)] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#F2EFE7] transition hover:border-[rgba(242,239,231,.24)] hover:bg-white/[0.08]"
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                ariaLabel="Abrir LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn <ArrowUpRight className="h-4 w-4 opacity-70" />
              </MagneticButton>

              <MagneticButton
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(242,239,231,.14)] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#F2EFE7] transition hover:border-[rgba(242,239,231,.24)] hover:bg-white/[0.08]"
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                ariaLabel="Abrir GitHub"
              >
                <Github className="h-4 w-4" />
                GitHub <ArrowUpRight className="h-4 w-4 opacity-70" />
              </MagneticButton>

              <MagneticButton
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[rgba(242,239,231,.14)] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#F2EFE7] transition hover:border-[rgba(242,239,231,.24)] hover:bg-white/[0.08]"
                href={CV_URL}
                target="_blank"
                rel="noreferrer"
                ariaLabel="Abrir CV"
              >
                <Download className="h-4 w-4" />
                CV <ArrowUpRight className="h-4 w-4 opacity-70" />
              </MagneticButton>
            </motion.div>

             <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             <div className="mt-5 flex items-center justify-between">
                <div className="font-[family-name:var(--font-brand)] text-sm font-semibold tracking-[0.14em] text-[#F2EFE7]/75">
                  HERMIT
                </div>
                <div className="text-xs text-white/45">
                  © {new Date().getFullYear()} {BRAND} — {ROL}
                </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
