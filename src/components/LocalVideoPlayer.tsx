"use client";

import { useEffect, useState, useRef } from "react";

type LocalVideoPlayerProps = {
  src: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  poster?: string | null;
  onMarkComplete?: () => void;
  lessonId?: string;
};

export function LocalVideoPlayer({
  src,
  title,
  description,
  thumbnail,
  poster,
  onMarkComplete,
  lessonId,
}: LocalVideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string>(src);
  const [loading, setLoading] = useState(!!lessonId);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  useEffect(() => {
    // If lessonId provided, generate secure token
    if (lessonId) {
      const generateToken = async () => {
        try {
          const response = await fetch("/api/video/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId }),
          });

          if (response.ok) {
            const data = await response.json();
            // For local provider, just use direct URL
            // In production with external providers, this would be encrypted
            setVideoUrl(src);
          }
        } catch (error) {
          console.error("Failed to get video token:", error);
          setVideoUrl(src);
        } finally {
          setLoading(false);
        }
      };

      generateToken();
    }
  }, [lessonId, src]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
          break;
        case "f":
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            videoRef.current.requestFullscreen();
          }
          break;
        case "m":
          e.preventDefault();
          videoRef.current.muted = !videoRef.current.muted;
          break;
        case "arrowleft":
          e.preventDefault();
          videoRef.current.currentTime = Math.max(
            0,
            videoRef.current.currentTime - 5
          );
          break;
        case "arrowright":
          e.preventDefault();
          videoRef.current.currentTime = Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + 5
          );
          break;
        case "j":
          e.preventDefault();
          videoRef.current.currentTime = Math.max(
            0,
            videoRef.current.currentTime - 10
          );
          break;
        case "l":
          e.preventDefault();
          videoRef.current.currentTime = Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + 10
          );
          break;
        case "0":
          e.preventDefault();
          videoRef.current.currentTime = 0;
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Track progress periodically (every 10 seconds)
  useEffect(() => {
    if (!lessonId || !videoRef.current) return;

    const saveProgress = async () => {
      if (!videoRef.current) return;

      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const completionPercent = Math.round((currentTime / duration) * 100);

      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            completionPercent: Math.min(completionPercent, 99), // Max 99% via auto-track
            watchTimeSeconds: Math.floor(currentTime),
          }),
        });
      } catch (error) {
        console.error("Failed to save progress:", error);
      }
    };

    const handlePlay = () => {
      progressIntervalRef.current = setInterval(saveProgress, 10000); // Every 10 seconds
    };

    const handlePause = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      saveProgress(); // Save on pause
    };

    const video = videoRef.current;
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handlePause);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handlePause);
    };
  }, [lessonId]);

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20">
        <div className="border-b border-slate-800 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            Vidéo de la leçon
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-950 p-5">
          <p className="text-slate-400">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl shadow-slate-950/20">
      <div className="border-b border-slate-800 p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
          Vidéo de la leçon
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-slate-300">{description}</p>
        ) : null}
      </div>

      <div className="p-5">
        <div className="relative">
          <video
            ref={videoRef}
            key={videoUrl}
            controls
            playsInline
            controlsList="nodownload"
            className="aspect-video w-full rounded-2xl bg-slate-950"
            poster={poster || thumbnail || undefined}
            src={videoUrl}
            data-testid="video-player"
          />

          {/* Custom speed control overlay */}
          <div className="absolute bottom-16 right-4 z-10">
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="rounded-lg bg-slate-900/90 backdrop-blur px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors border border-slate-700"
                data-testid="speed-control-btn"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 rounded-lg border border-slate-700 bg-slate-900/95 backdrop-blur shadow-xl">
                  <div className="p-2 space-y-1">
                    {speeds.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`block w-full rounded px-3 py-2 text-sm text-start transition-colors ${
                          speed === playbackRate
                            ? "bg-[#FDCD1A] text-slate-950 font-medium"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                        data-testid={`speed-option-${speed}`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            Raccourcis clavier
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-3">
            <div>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                Espace
              </kbd>{" "}
              Lecture/Pause
            </div>
            <div>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                F
              </kbd>{" "}
              Plein écran
            </div>
            <div>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                M
              </kbd>{" "}
              Muet
            </div>
            <div>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                ← →
              </kbd>{" "}
              ±5 sec
            </div>
            <div>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                J L
              </kbd>{" "}
              ±10 sec
            </div>
            <div>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                0
              </kbd>{" "}
              Début
            </div>
          </div>
        </div>

        {onMarkComplete ? (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onMarkComplete}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-600 transition-colors"
              data-testid="mark-complete-btn"
            >
              Marquer comme terminée
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
