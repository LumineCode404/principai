"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Volume2, Play, Pause, AudioLines } from "lucide-react";

/**
 * VoiceSummary — the Chinese voice tooltip.
 *
 * Rendered ONLY on Chinese (zh) principle pages: every principle carries a
 * short spoken summary, generated from the page's own frontmatter summary.
 * The audio is a static asset (public/voice/zh/<slug>.mp3), fetched lazily on
 * first play (preload="none"), so the page weight is untouched until used.
 *
 * Design notes:
 * - The button toggles a popover (framer-motion, transform/opacity only).
 * - A decorative equalizer animates while audio plays.
 * - prefers-reduced-motion disables the equalizer dance.
 */

export function VoiceSummary({ slug, summary }: { slug: string; summary?: string }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();

  const src = `/voice/zh/${slug}.mp3`;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const ensureAudio = () => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(src);
    audio.preload = "none";
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      setState("ready");
    });
    audio.addEventListener("timeupdate", () => {
      setCurrent(audio.currentTime);
      if (audio.duration > 0) setProgress((audio.currentTime / audio.duration) * 100);
    });
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
    });
    audio.addEventListener("error", () => setState("error"));
    audioRef.current = audio;
    return audio;
  };

  const togglePlay = () => {
    const audio = ensureAudio();
    if (state === "idle") {
      setState("loading");
      audio
        .load()
        .catch(() => {})
        .finally(() => {
          // load() is sync-ish; metadata event flips state to ready.
        });
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          setState("ready");
        })
        .catch(() => setState("error"));
    }
  };

  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  return (
    <div className="relative mb-4 inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="收听本原则的中文语音摘要"
        className="inline-flex h-8 items-center gap-2 rounded-lg border border-[rgba(2,130,216,0.4)] bg-[rgba(2,130,216,0.08)] px-3 text-[13px] font-medium text-[#5CB3F2] transition-colors hover:bg-[rgba(2,130,216,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Volume2 className="h-3.5 w-3.5" aria-hidden />
        听本原则
        <span className="font-mono text-[10px] uppercase tracking-wide opacity-70">
          voice · zh
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="中文语音摘要"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute left-0 top-10 z-30 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-[rgba(77,75,91,0.5)] bg-[#0B0B0F] p-4 shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0282D8]">
                <AudioLines className="h-3.5 w-3.5" aria-hidden />
                语音摘要 · Voice summary
              </p>
              <span className="font-mono text-[11px] text-[#8B89A0]">
                {fmt(current)} / {fmt(duration)}
              </span>
            </div>

            <p className="mt-3 text-[14px] leading-relaxed text-white/90">
              {summary ?? "本原则的中文语音摘要。"}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "暂停" : "播放"}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0273C4] text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {playing ? (
                  <Pause className="h-4 w-4" aria-hidden />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" aria-hidden />
                )}
              </button>

              <div
                className="h-8 flex-1 overflow-hidden rounded-lg border border-[rgba(77,75,91,0.4)] bg-[#070707]"
                role="presentation"
              >
                <div
                  className="flex h-full items-center justify-center gap-[3px] px-2"
                  aria-hidden
                >
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-[#0282D8]"
                      style={
                        playing && !reduceMotion
                          ? {
                              height: `${6 + ((i * 13) % 20)}px`,
                              animation: `voicebar 1.1s ease-in-out ${i * 0.045}s infinite alternate`,
                            }
                          : {
                              height: `${4 + ((i * 7) % 9)}px`,
                              opacity: 0.45,
                            }
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#15151B]">
              <div
                className="h-full rounded-full bg-[#0282D8] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            {state === "error" && (
              <p className="mt-3 text-xs text-[#8B89A0]">
                语音文件暂不可用——请稍后再试。
              </p>
            )}
            {state === "loading" && (
              <p className="mt-3 text-xs text-[#8B89A0]">正在加载语音……</p>
            )}

            <p className="mt-3 border-t border-[rgba(77,75,91,0.35)] pt-3 text-[11px] leading-relaxed text-[#8B89A0]">
              中文区专属：每条原则都有一段由摘要生成的语音。英文与印尼语区没有语音——语言越接近母语，越值得用耳朵读一遍。
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes voicebar {
          from { transform: scaleY(0.35); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
