/* Monoline icon set — exported to window.Icons */
const Icons = (() => {
  const S = (props) => ({
    width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round",
    strokeLinejoin: "round", ...props,
  });

  const hvac = (p) => (
    <svg {...S(p)}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  );
  const calendar = (p) => (
    <svg {...S(p)}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9h17M8 2.5v4M16 2.5v4M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" />
    </svg>
  );
  const bolt = (p) => (
    <svg {...S(p)}>
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" />
    </svg>
  );
  const arrows = (p) => (
    <svg {...S(p)}>
      <path d="M7 14l-3 3 3 3M4 17h9a4 4 0 0 0 4-4M17 10l3-3-3-3M20 7h-9a4 4 0 0 0-4 4" />
    </svg>
  );
  const sliders = (p) => (
    <svg {...S(p)}>
      <path d="M5 4v6M5 14v6M12 4v3M12 11v9M19 4v9M19 17v3" />
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="9" r="2" /><circle cx="19" cy="15" r="2" />
    </svg>
  );
  const clipboard = (p) => (
    <svg {...S(p)}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4a3 3 0 0 1 6 0M8.5 11h7M8.5 14.5h7M8.5 18h4" />
      <path d="M9 4h6v2.5H9z" fill="currentColor" stroke="none" opacity=".0" />
    </svg>
  );
  const close = (p) => (
    <svg {...S(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
  );
  const phone = (p) => (
    <svg {...S(p)}>
      <path d="M5 4h3.5l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
  const check = (p) => (
    <svg {...S({ ...p, strokeWidth: 2.4, width: 28, height: 28 })}><path d="M5 12.5 10 17l9-10" /></svg>
  );
  const arrowR = (p) => (
    <svg {...S(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  );

  const map = { hvac, calendar, bolt, arrows, sliders, clipboard };
  const Cap = ({ name, ...p }) => (map[name] || hvac)(p);
  return { Cap, close, phone, check, arrowR };
})();

window.Icons = Icons;
