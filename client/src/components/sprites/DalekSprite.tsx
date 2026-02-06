export default function DalekSprite({ size }: { size: number }) {
  const s = size * 0.85;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="22" width="16" height="8" rx="1" fill="#8B7355" />
      <circle cx="11" cy="26" r="1.2" fill="#6B5B45" />
      <circle cx="16" cy="26" r="1.2" fill="#6B5B45" />
      <circle cx="21" cy="26" r="1.2" fill="#6B5B45" />
      <circle cx="11" cy="23.5" r="1" fill="#6B5B45" />
      <circle cx="16" cy="23.5" r="1" fill="#6B5B45" />
      <circle cx="21" cy="23.5" r="1" fill="#6B5B45" />
      <path d="M9 22 L16 14 L23 22 Z" fill="#A0936E" />
      <rect x="12" y="14" width="8" height="4" rx="1" fill="#BBA98A" />
      <rect x="13.5" y="10" width="5" height="5" rx="2.5" fill="#C4B494" />
      <circle cx="16" cy="12.5" r="1.8" fill="#333" />
      <circle cx="16" cy="12.5" r="1" fill="#66CCFF" />
      <rect x="14.5" y="7" width="3" height="3.5" rx="1.5" fill="#A0936E" />
      <circle cx="16" cy="6.5" r="1.5" fill="#66CCFF" />
      <line x1="7" y1="18" x2="12" y2="16" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6" cy="18" r="1.2" fill="#66CCFF" />
      <line x1="20" y1="16" x2="25" y2="14" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="25.5" cy="13.5" r="1" fill="#66CCFF" />
    </svg>
  );
}
