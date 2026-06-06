/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        loop: {
          ink: "#05070d",
          panel: "#0c111d",
          raised: "#111827",
          bevel: "#1d2636",
          line: "#273449",
          muted: "#94a3b8",
          blue: "#33a7ff",
          green: "#3cffb4",
          purple: "#a855f7",
          warning: "#facc15",
          danger: "#fb7185"
        }
      },
      boxShadow: {
        "neo-panel":
          "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -18px 36px rgba(0,0,0,0.20), 0 24px 70px rgba(0,0,0,0.45)",
        "neo-button":
          "inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -10px 18px rgba(0,0,0,0.28), 0 14px 30px rgba(51,167,255,0.20)",
        "neo-pressed":
          "inset 0 8px 18px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.08), 0 5px 12px rgba(0,0,0,0.35)",
        "glow-blue": "0 0 30px rgba(51,167,255,0.34)",
        "glow-green": "0 0 30px rgba(60,255,180,0.28)",
        "glow-purple": "0 0 32px rgba(168,85,247,0.32)"
      },
      backgroundImage: {
        "glass-sheen":
          "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.035) 38%, rgba(255,255,255,0.08))",
        "carbon-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)"
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 18px rgba(60,255,180,0.22)" },
          "50%": { boxShadow: "0 0 36px rgba(60,255,180,0.40)" }
        }
      },
      animation: {
        pop: "pop 420ms cubic-bezier(.2,.8,.2,1)",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite"
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".glass-panel": {
          background:
            "linear-gradient(145deg, rgba(17,24,39,0.84), rgba(5,7,13,0.72))",
          border: "1px solid rgba(148,163,184,0.18)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)"
        },
        ".pressable": {
          transition:
            "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease"
        },
        ".pressable:active": {
          transform: "translateY(2px) scale(0.985)",
          boxShadow:
            "inset 0 8px 18px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.08), 0 5px 12px rgba(0,0,0,0.35)"
        }
      });
    }
  ]
};
