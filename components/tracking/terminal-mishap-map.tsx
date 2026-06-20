import { Box, Package } from "lucide-react";

export type TerminalMapMode = "blackout" | "hypercube" | "energy" | "noclip" | "drafted";

const binary = "010011001001101001011010011010010110010110100101101001".split("");

export function TerminalMishapMap({ mode }: { mode: TerminalMapMode }) {
  if (mode === "hypercube") {
    return (
      <div className="terminal-map terminal-map--hypercube">
        <div className="terminal-map-grid" />
        <div className="hypercube-lens" />
        <div className="hypercube-package"><Package className="size-7" /></div>
        <div className="hypercube-point" />
        <MapCaption eyebrow="Dimensional integrity: failed" title="Package geometry is now legally ambiguous." />
      </div>
    );
  }

  if (mode === "energy") {
    return (
      <div className="terminal-map terminal-map--energy">
        <div className="terminal-map-grid" />
        <div className="energy-route" />
        <div className="energy-origin"><Package className="size-6" /></div>
        <div className="energy-binary" aria-hidden="true">
          {binary.map((digit, index) => (
            <span
              key={index}
              style={{ left: `${(index * 17) % 97}%`, animationDelay: `${(index % 12) * -0.19}s`, animationDuration: `${1.8 + (index % 5) * 0.22}s` }}
            >
              {digit}
            </span>
          ))}
        </div>
        <MapCaption eyebrow="Matter status: deprecated" title="Package successfully uploaded nowhere useful." />
      </div>
    );
  }

  if (mode === "noclip") {
    return (
      <div className="terminal-map terminal-map--noclip">
        <div className="noclip-texture" />
        <div className="noclip-hole" />
        <div className="noclip-package"><Package className="size-7" /></div>
        <MapCaption eyebrow="Collision mesh: absent" title="Courier is beneath the map and gaining speed." />
      </div>
    );
  }

  if (mode === "drafted") {
    return (
      <div className="terminal-map terminal-map--drafted">
        <div className="terminal-map-grid" />
        <div className="drafted-package"><Box className="size-10" /></div>
        <div className="drafted-stamp">DRAFTED</div>
        <MapCaption eyebrow="Galactic service record: classified" title="Your package now answers to a superior officer." />
      </div>
    );
  }

  return (
    <div className="terminal-map terminal-map--blackout">
      <div className="blackout-stars" />
      <MapCaption eyebrow="Signal unavailable" title="Nothing on Earth to display." />
    </div>
  );
}

function MapCaption({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="terminal-map-caption">
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] opacity-60">{eyebrow}</p>
      <p className="mt-2 font-display text-xl font-bold">{title}</p>
    </div>
  );
}
