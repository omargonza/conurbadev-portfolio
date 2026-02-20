'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Github,
  ExternalLink,
  Mail,
  Linkedin,
  Download,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Code2,
  Layers,
  ShieldCheck,
} from 'lucide-react';

/* =========================
   Identidad (conurbaDEV)
========================= */
const BRAND = 'conurbaDEV';
const NOMBRE = 'Omar Gonzalo Martínez';
const ROL = 'Backend Python/Django · APIs y sistemas';
const UBICACION = 'Buenos Aires, AR · Remoto';

const EMAIL = 'gonzamartinez1081@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/gonzalo-martinez-';
const GITHUB = 'https://github.com/omargonza';

// 👇 Archivo dentro de /public (ajustá si tu pdf se llama distinto)
const CV_URL = '/cvgonza10.pdf';

/* =========================
   Tipos
========================= */
type GalleryItem = { src: string; alt: string; label: string };

type Project = {
  slug: 'ot' | 'yoquet' | 'ingles';
  titulo: string;
  subtitulo: string;
  stack: string[];
  demo: string;
  repo: string;
  repo2?: string;
  puntos: string[];
  gallery: GalleryItem[];
};

/* =========================
   Helpers
========================= */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function useMouseSpotlight(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    return () => el.removeEventListener('mousemove', onMove);
  }, [ref]);
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
      setXy({ x: clamp(dx * 0.10, -10, 10), y: clamp(dy * 0.10, -10, 10) });
    };

    const onLeave = () => setXy({ x: 0, y: 0 });

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [href]);

  const motionStyle = { translateX: xy.x, translateY: xy.y } as React.CSSProperties;
  const motionTransition = { type: 'spring' as const, stiffness: 380, damping: 26 };

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



function IconChip({ icon: Icon, title, value }: { icon: LucideIcon; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_10px_30px_rgba(0,0,0,.35)]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
        <Icon className="h-4 w-4 text-white/45" />
        {title}
      </div>
      <div className="mt-2 text-sm font-medium text-white/90">{value}</div>
      <div className="mt-3 h-[2px] w-10 rounded-full bg-[rgba(225,16,45,.95)]" />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto mt-12 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
          <div className="text-sm font-semibold text-white/85">{item.label}</div>
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
  useMouseSpotlight(wrapRef as unknown as React.RefObject<HTMLElement>);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4"
      style={{
        backgroundImage: `
          radial-gradient(650px 260px at var(--mx, 50%) var(--my, 20%),
            rgba(225,16,45,.16),
            transparent 60%),
          radial-gradient(900px 420px at 50% 0%,
            rgba(255,255,255,.06),
            transparent 55%)
        `,
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-white/55">Capturas</div>
        <div className="text-[11px] text-white/45">mobile · tablet · web</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((x) => (
          <motion.button
            key={x.src}
            type="button"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/30 text-left"
            onClick={() => onOpen?.(x)}
          >
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: brandAccent
                  ? `radial-gradient(650px 260px at 50% 0%, rgba(225,16,45,.22), transparent 60%)`
                  : '',
              }}
            />
            <div className="relative h-44 w-full sm:h-48 md:h-52 lg:h-44">
              <Image
                src={x.src}
                alt={x.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-black/35 px-3 py-2 text-xs">
              <span className="text-white/75">{x.label}</span>
              <span className="inline-flex items-center gap-2 text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(225,16,45,.95)]" />
                conurba
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* =========================
   Página
========================= */

/* =========================
   Página
========================= */
export default function Page() {
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`[Portfolio] ${BRAND}`)}`;

  const projects: Project[] = useMemo(
    () => [
      {
        slug: 'ot',
        titulo: 'OT-ELÉCTRICOS — Sistema de Mantenimiento (Producción)',
        subtitulo: 'OTs, historial, tableros/luminarias, evidencias y PDF operativo',
        stack: ['Django/DRF', 'React', 'PostgreSQL', 'PDF', 'Offline'],
        demo: 'https://ot-frontend-pro.onrender.com',
        repo: 'https://github.com/omargonza/sistema-mantenimiento-electrico.git',
        puntos: [
          'APIs REST con validación/normalización para consistencia de datos',
          'Reportes técnicos en PDF y workflow operativo',
          'Modo offline para uso en campo y sincronización',
        ],
        gallery: [
          { src: '/projects/ot/01-dashboard.jpg', alt: 'Centro de control OT', label: 'Centro de control' },
          { src: '/projects/ot/02-nueva-ot.jpg', alt: 'Nueva OT', label: 'Nueva OT' },
          { src: '/projects/ot/03-historial.jpg', alt: 'Historial', label: 'Historial' },
          { src: '/projects/ot/04-pdfs.jpg', alt: 'PDFs', label: 'Mis PDFs' },
        ],
      },
      {
        slug: 'yoquet',
        titulo: 'Yoquet Diseños — E-commerce (Producción)',
        subtitulo: 'Catálogo, carrito, flujo de compra y despliegue',
        stack: ['Backend', 'Frontend', 'Deploy'],
        demo: 'https://yoquet-disenos-frontend.onrender.com',
        repo: 'https://github.com/omargonza/yoquet_disenos_backend.git',
        repo2: 'https://github.com/omargonza/yoquet_disenos_frontend.git',
        puntos: ['Arquitectura separada backend/frontend', 'Experiencia de compra completa', 'Demo pública en producción'],
        gallery: [
          { src: '/projects/yoquet/01-hero.jpg', alt: 'Inicio Yoquet', label: 'Inicio' },
          { src: '/projects/yoquet/02-catalogo.jpg', alt: 'Catálogo', label: 'Catálogo' },
          { src: '/projects/yoquet/03-filtrado.jpg', alt: 'Filtrado', label: 'Filtrado' },
          { src: '/projects/yoquet/04-carrito.jpg', alt: 'Carrito', label: 'Carrito' },
        ],
      },
      {
        slug: 'ingles',
        titulo: 'Miss Noe — Landing (Deploy)',
        subtitulo: 'Landing responsive lista para SEO/analítica',
        stack: ['React', 'Vite', 'Responsive', 'Deploy'],
        demo: 'https://omargonza.github.io/online/',
        repo: 'https://github.com/omargonza/online.git',
        puntos: ['Responsive real mobile/tablet', 'Estructura escalable', 'Deploy en GitHub Pages'],
        gallery: [
          { src: '/projects/ingles/01-hero.jpg', alt: 'Hero Miss Noe', label: 'Hero' },
          { src: '/projects/ingles/02-sobre.jpg', alt: 'Sobre Miss Noe', label: 'Sobre' },
          { src: '/projects/ingles/03-objetivo.jpg', alt: 'Objetivo', label: 'Objetivo' },
          { src: '/projects/ingles/04-cta.jpg', alt: 'Llamados a acción', label: 'CTAs' },
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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      {/* Fondo industrial: glow + grano */}
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ y: bgYSpring }}>
        <div
          className="absolute inset-0 opacity-[0.95]"
          style={{
            backgroundImage: `
              radial-gradient(1100px 500px at 20% 0%, rgba(225,16,45,.22), transparent 60%),
              radial-gradient(900px 420px at 80% 10%, rgba(255,255,255,.06), transparent 60%),
              radial-gradient(1200px 600px at 50% 110%, rgba(225,16,45,.12), transparent 55%),
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
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute -left-4 top-2 h-12 w-12 rotate-12 bg-[rgba(225,16,45,.25)] blur-xl" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">
                conurba<span className="text-[rgba(225,16,45,1)]">DEV</span>
              </div>
              <div className="text-xs text-white/55">{ROL}</div>
            </div>
          </div>

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
            initial="hidden"
            animate="show"
            variants={container}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,.55)] sm:p-8 md:p-10"
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06]" />
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[rgba(225,16,45,.22)] blur-3xl" />
            <div className="pointer-events-none absolute -right-28 top-16 h-72 w-72 rounded-full bg-white/[0.07] blur-3xl" />

            <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
              <div>
                <motion.div variants={item} className="inline-flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70">
                    <MapPin className="h-3.5 w-3.5" />
                    {UBICACION}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70">
                    <Sparkles className="h-3.5 w-3.5 text-[rgba(225,16,45,1)]" />
                    Disponible para freelance remoto
                  </span>
                </motion.div>

                <motion.h1 variants={item} className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
                  conurba<span className="text-[rgba(225,16,45,1)]">DEV</span> —{' '}
                  <span className="text-[rgba(225,16,45,1)]">Python/Django</span>
                  <br />
                  Backend que aguanta producción. Sin chamuyo.
                </motion.h1>

                <motion.p variants={item} className="mt-4 max-w-2xl text-[15px] leading-7 text-white/72">
                  Soy {NOMBRE}. Hago backend con criterio: APIs claras, datos prolijos, auth bien hecha, performance,
                  reportes/PDF y deploy sin drama. Si el proyecto lo pide, meto frontend para entregar cerrado.
                </motion.p>

                <motion.div variants={item} className="mt-5 flex flex-wrap gap-2">
                  {['Python', 'Django/DRF', 'PostgreSQL', 'REST', 'Auth', 'PDF', 'Offline'].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </motion.div>

                <motion.div variants={item} className="mt-7 grid gap-3 sm:grid-cols-2">
                  <MagneticButton
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[rgba(225,16,45,1)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(225,16,45,.25)] transition hover:brightness-110 active:brightness-95"
                    href={mailto}
                    ariaLabel="Contactar por email"
                  >
                    <Mail className="h-4 w-4" />
                    Hablemos
                    <ArrowUpRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </MagneticButton>

                  <MagneticButton
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-white/20 hover:bg-white/[0.06]"
                    href={CV_URL}
                    target="_blank"
                    rel="noreferrer"
                    ariaLabel="Descargar CV"
                  >
                    <Download className="h-4 w-4" />
                    Descargar CV
                    <ArrowUpRight className="h-4 w-4 opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </MagneticButton>
                </motion.div>

                <motion.div variants={item} className="mt-7 text-xs text-white/45">
                  <span className="text-white/60">Mantra:</span> prolijo, medible, entregable. Si no se puede sostener,
                  no se hace.
                </motion.div>
              </div>

              <motion.div variants={item} className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <IconChip icon={Code2} title="Forma de laburo" value="Iterativo · entregas cortas" />
                <IconChip icon={Layers} title="Calidad" value="DX · mantenibilidad · consistencia" />
                <IconChip icon={ShieldCheck} title="Producción" value="Confiable · sin sorpresas" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* PROYECTOS */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-90px' }} variants={container}>
            <motion.div variants={item}>
              <div className="text-xs uppercase tracking-widest text-white/50">Laburo real (sin maqueta)</div>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Casos reales</h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-white/70">
                Proyectos con demo y repos. Cosas que corren, se usan y se mantienen. Lo que ves acá es entregable.
              </p>
            </motion.div>

            <div className="mt-7 grid gap-6 lg:grid-cols-3">
              {projects.map((p) => (
                <motion.article
                  key={p.titulo}
                  variants={item}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_55px_rgba(0,0,0,.55)]"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl" />
                    <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[rgba(225,16,45,.16)] blur-3xl" />
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-white/95">{p.titulo}</div>
                        <div className="mt-1 text-xs text-white/60">{p.subtitulo}</div>
                      </div>
                      <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04]" />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <ul className="mt-4 space-y-2 text-sm text-white/72">
                      {p.puntos.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(225,16,45,.95)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <MagneticButton
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
                        href={p.demo}
                        target="_blank"
                        rel="noreferrer"
                        ariaLabel="Abrir demo"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver demo <ArrowUpRight className="h-4 w-4 opacity-60" />
                      </MagneticButton>

                      <MagneticButton
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
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
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]"
                          href={p.repo2}
                          target="_blank"
                          rel="noreferrer"
                          ariaLabel="Abrir repo frontend"
                        >
                          <Github className="h-4 w-4" />
                          Repo front <ArrowUpRight className="h-4 w-4 opacity-60" />
                        </MagneticButton>
                      ) : null}
                    </div>

                    <div className="mt-5">
                      <Gallery items={p.gallery} onOpen={setLightbox} />
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
            viewport={{ once: true, margin: '-90px' }}
            variants={container}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,.55)] sm:p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -left-28 -bottom-28 h-80 w-80 rounded-full bg-[rgba(225,16,45,.18)] blur-3xl" />
            <div className="pointer-events-none absolute -right-28 top-12 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />

            <motion.div variants={item} className="text-xs uppercase tracking-widest text-white/50">
              Contacto
            </motion.div>
            <motion.h2 variants={item} className="mt-2 text-2xl font-semibold sm:text-3xl">
              Charlémoslo
            </motion.h2>
            <motion.p variants={item} className="mt-2 max-w-2xl text-[15px] leading-7 text-white/70">
              Si te sirve mi perfil, lo bajamos a tierra: alcance, plazos, entregables y cómo medimos éxito. Cero
              verso, todo concreto.
            </motion.p>

            <motion.div variants={item} className="mt-6 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
              <MagneticButton
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[rgba(225,16,45,1)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(225,16,45,.25)] transition hover:brightness-110 active:brightness-95"
                href={mailto}
                ariaLabel="Enviar email"
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
                <ArrowUpRight className="h-4 w-4 opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>

              <MagneticButton
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-white/20 hover:bg-white/[0.06]"
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                ariaLabel="Abrir LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn <ArrowUpRight className="h-4 w-4 opacity-70" />
              </MagneticButton>

              <MagneticButton
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-white/20 hover:bg-white/[0.06]"
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                ariaLabel="Abrir GitHub"
              >
                <Github className="h-4 w-4" />
                GitHub <ArrowUpRight className="h-4 w-4 opacity-70" />
              </MagneticButton>

              <MagneticButton
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-white/20 hover:bg-white/[0.06]"
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
            <div className="mt-5 text-xs text-white/45">
              © {new Date().getFullYear()} {BRAND} — {ROL}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
