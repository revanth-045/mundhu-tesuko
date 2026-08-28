const P = {
  check:   "M20 6 9 17l-5-5",
  checkC:  "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14.01l-3-3",
  doc:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15h6M9 11h2",
  mic:     "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  stop:    "M6 6h12v12H6z",
  compare: "M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4",
  home:    "M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
  search:  "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  speaker: "M11 5 6 9H2v6h4l5 4zM19.1 4.9a10 10 0 0 1 0 14.2M15.5 8.5a5 5 0 0 1 0 7",
  copy:    "M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  alert:   "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  ban:     "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM4.9 4.9l14.2 14.2",
  trash:   "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  back:    "M19 12H5M12 19l-7-7 7-7",
  fwd:     "M5 12h14M12 5l7 7-7 7",
  star:    "m12 2 3 6.5 7 1-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4l-5-4.9 7-1z",
  health:  "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z",
  house:   "M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
  cap:     "M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5",
  flame:   "M12 22a7 7 0 0 0 7-7c0-4-4-5-4-9 0 0-3 1.5-3 5 0-2-2-3-2-3s-5 3-5 7a7 7 0 0 0 7 7z",
  bolt:    "M13 2 4 14h7l-1 8 9-12h-7z",
  ring:    "m12 3 3 4-3 3-3-3zM12 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12z",
  rupee:   "M6 3h12M6 8h12M9 21 6 8m0 0c6 0 8 0 8 4s-4 4-8 4",
  scale:   "M12 3v18M5 8h14M7 8l-3 6h6zM17 8l-3 6h6z",
  eye:     "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
};
export default function Icon({ n, s = 20, w = 1.75, style }) {
  const d = P[n];
  if (!d) return null;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
