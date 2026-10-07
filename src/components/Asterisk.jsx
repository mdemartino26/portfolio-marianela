const PETALS = [0, 60, 120, 180, 240, 300];

export default function Asterisk({ className = '' }) {
  return (
    <svg className={`asterisk ${className}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {PETALS.map((angle) => (
        <ellipse key={angle} cx="50" cy="27" rx="10" ry="19" transform={`rotate(${angle} 50 50)`} />
      ))}
    </svg>
  );
}
