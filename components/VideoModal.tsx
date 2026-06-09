"use client";

import { useEffect, useCallback } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  embedId: string | null;
  url: string;
};

export default function VideoModal({ isOpen, onClose, title, embedId, url }: Props) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scrolling while modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        // Close when clicking the backdrop (not the content)
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full
                   flex items-center justify-center text-lg
                   bg-[var(--surface)] border border-[var(--border)]
                   text-[var(--text-muted)] hover:text-[var(--text)]
                   hover:border-[var(--text-muted)] transition-colors"
        aria-label="Close modal"
      >
        ✕
      </button>

      {/* Modal content */}
      <div
        className="relative w-full max-w-3xl rounded-xl bg-[var(--surface)] border border-[var(--border)]
                    shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="px-5 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--text)] truncate">{title}</h3>
        </div>

        {/* Content */}
        {embedId ? (
          /* Embedded YouTube iframe (supports both videos and playlists) */
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${embedId}${embedId.includes("?") ? "&" : "?"}autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          /* Fallback for non-embeddable URLs (playlists, shorts, etc.) */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <p className="text-[var(--text-muted)] text-sm">
              此影片無法內嵌播放（可能是播放清單或 Shorts）
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                         bg-purple-500/10 text-purple-400 font-medium text-sm
                         hover:bg-purple-500/20 transition-colors"
            >
              📺 在 YouTube 開啟
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
