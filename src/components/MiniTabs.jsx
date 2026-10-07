import { useId, useRef } from 'react';

// Pestañas internas con el mismo lenguaje de carpeta que el menú.
// tabs: [{ id, label }]. El contenido del panel activo llega como children.
export default function MiniTabs({ tabs, active, onChange, label, children }) {
  const baseId = useId();
  const listRef = useRef(null);

  function handleKeyDown(event) {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    onChange(next.id);
    listRef.current?.querySelector(`[data-tab="${next.id}"]`)?.focus();
  }

  return (
    <div className="mini-tabs">
      <div
        ref={listRef}
        className="mini-tabs__list"
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            data-tab={tab.id}
            className="mini-tab"
            aria-selected={tab.id === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={tab.id === active ? 0 : -1}
            onClick={() => onChange(tab.id)}
          >
            ( {tab.label} )
          </button>
        ))}
      </div>

      <div
        className="mini-tabs__panel"
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
      >
        <div key={active} className="mini-tabs__content">
          {children}
        </div>
      </div>
    </div>
  );
}
