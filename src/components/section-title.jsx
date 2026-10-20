// Section heading with a colored symbol in front: "⇒ about me", "{ skills", etc.
// color: 'coral' | 'mint' | 'purple'
export default function SectionTitle({ symbol, color, children }) {
  return (
    <h2 className="section-title" data-aos="fade-up">
      <span className={`section-title-symbol text-${color}`} aria-hidden="true">
        {symbol}
      </span>
      {children}
    </h2>
  );
}
