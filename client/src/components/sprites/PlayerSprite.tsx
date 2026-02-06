export default function PlayerSprite({ size }: { size: number }) {
  const s = size * 0.85;
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="6" r="4" fill="#FFD93D" />
      <line x1="16" y1="10" x2="16" y2="20" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="13" x2="10" y2="9" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="14" x2="23" y2="17" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="20" x2="10" y2="29" stroke="#FFD93D" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="20" x2="22" y2="27" stroke="#FFD93D" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="14.5" cy="5.5" r="0.8" fill="#1a1a2e" />
      <circle cx="17.5" cy="5.5" r="0.8" fill="#1a1a2e" />
    </svg>
  );
}
