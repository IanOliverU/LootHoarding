import "server-only";

export const MISHAP_PROBABILITY = 0.15;

export const MISHAP_EVENTS = [
  "Your courier was abducted by a UFO.",
  "A whale swallowed your shipment’s coordinates.",
  "The courier stopped for fishball and briefly forgot the assignment.",
  "GPS rerouted the shipment through a parallel dimension.",
  "The courier is arguing with a jeepney driver about right of way.",
  "A suspiciously organized flock of pigeons has claimed the package.",
] as const;

export type MishapResult = {
  text: string;
  type: "courier_mishap";
  triggeredAt: string;
  resolvedAt: string | null;
};

export function rollMishap(random: () => number = Math.random): MishapResult | null {
  return triggerMishap(false, random);
}

export function triggerMishap(force = false, random: () => number = Math.random): MishapResult | null {
  if (!force && random() >= MISHAP_PROBABILITY) return null;
  const text = MISHAP_EVENTS[Math.floor(random() * MISHAP_EVENTS.length)];
  return {
    text,
    type: "courier_mishap",
    triggeredAt: new Date().toISOString(),
    resolvedAt: null,
  };
}
