export default function PileSprite({ size }: { size: number }) {
  const s = size * 0.85;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="16" cy="27" rx="12" ry="3" fill="#4A4040" />
      <path d="M6 27 C6 22 10 20 12 18 C13 17 11 15 14 14 C16 13 15 16 18 15 C20 14 19 12 22 14 C24 15 22 17 24 19 C26 21 26 24 26 27 Z" fill="#5C5050" />
      <path d="M8 27 C8 24 11 22 13 20 C14 19 13 18 15 17 C17 16 16 19 19 18 C21 17 20 16 22 18 C24 20 24 23 24 27 Z" fill="#6B5E5E" />
      <rect x="10" y="16" width="4" height="2" rx="0.5" fill="#7A6B5B" transform="rotate(-20 12 17)" />
      <rect x="17" y="14" width="5" height="1.5" rx="0.5" fill="#8B7D6B" transform="rotate(15 19 15)" />
      <rect x="14" y="19" width="3" height="1.5" rx="0.5" fill="#6B5B4B" transform="rotate(-10 15 20)" />
      <circle cx="12" cy="22" r="1.5" fill="#7A6B5B" />
      <circle cx="19" cy="20" r="1.2" fill="#8B7D6B" />
      <circle cx="15" cy="24" r="1" fill="#5C5050" />
      <path d="M11 15 L13 12" stroke="#7A6B5B" strokeWidth="1" strokeLinecap="round" />
      <path d="M20 13 L22 10" stroke="#6B5B4B" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
