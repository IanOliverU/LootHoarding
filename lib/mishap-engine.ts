import "server-only";

import type { MishapCode, OrderMishap } from "@/lib/orders";

export const MISHAP_PROBABILITY = 0.15;

type MishapEvent = {
  code: MishapCode;
  text: string;
  recoverable: boolean;
  terminalMessage: string | null;
  mapMode: NonNullable<OrderMishap["mapMode"]>;
};

export const MISHAP_EVENTS: readonly MishapEvent[] = [
  {
    code: "ufo_abduction",
    text: "Your courier was abducted by a UFO.",
    recoverable: false,
    terminalMessage: "Tracking signal left Earth without filing the proper paperwork. Package and delivery rider are both missing. Delivery is no longer available on this planet.",
    mapMode: "blackout",
  },
  {
    code: "whale_swallow",
    text: "A whale swallowed your shipment, its coordinates, and the courier’s remaining optimism.",
    recoverable: false,
    terminalMessage: "Last ping: the Pacific’s suspicious triangle. Package presumed marinated. Delivery has been permanently cancelled by marine management.",
    mapMode: "bermuda",
  },
  {
    code: "fishball_break",
    text: "The courier stopped for fishball and briefly forgot the assignment.",
    recoverable: true,
    terminalMessage: null,
    mapMode: "normal",
  },
  {
    code: "parallel_dimension",
    text: "GPS rerouted the shipment through a parallel dimension with slightly better road markings.",
    recoverable: true,
    terminalMessage: null,
    mapMode: "normal",
  },
  {
    code: "jeepney_argument",
    text: "The courier is arguing with a jeepney driver about right of way. Neither has produced a diagram.",
    recoverable: true,
    terminalMessage: null,
    mapMode: "normal",
  },
  {
    code: "pigeon_claim",
    text: "A suspiciously organized flock of pigeons has claimed the package pending arbitration.",
    recoverable: true,
    terminalMessage: null,
    mapMode: "normal",
  },
  {
    code: "capybara_customs",
    text: "The shipment is being inspected by capybara customs. The paperwork is now damp.",
    recoverable: true,
    terminalMessage: null,
    mapMode: "normal",
  },
  {
    code: "wrong_timeline",
    text: "The package entered the wrong timeline, where you already own it and still haven’t opened the box.",
    recoverable: true,
    terminalMessage: null,
    mapMode: "normal",
  },
  {
    code: "personal_rain_cloud",
    text: "A small rain cloud is following only the courier. Meteorologists have declined to get involved.",
    recoverable: true,
    terminalMessage: null,
    mapMode: "normal",
  },
  {
    code: "hypercube_fold",
    text: "The shipment was folded into a four-dimensional hypercube during an unauthorized shortcut.",
    recoverable: false,
    terminalMessage: "The package now occupies several mutually exclusive locations. Geometry has rejected the delivery request. Recovery is not available in three dimensions.",
    mapMode: "hypercube",
  },
  {
    code: "pure_energy",
    text: "A static electricity incident converted the package into pure energy and several billion unclaimed data packets.",
    recoverable: false,
    terminalMessage: "The physical package no longer meets the minimum requirement of being physical. Its remaining bits are touring the global internet without tracking enabled.",
    mapMode: "energy",
  },
  {
    code: "noclip_zone",
    text: "The courier entered a no-clip zone and fell through the collision mesh of reality.",
    recoverable: false,
    terminalMessage: "Courier and package are below the world map, still falling. Customer support cannot scroll that far. Delivery permanently cancelled.",
    mapMode: "noclip",
  },
  {
    code: "galactic_draft",
    text: "A clerical error drafted the package into the Galactic Military.",
    recoverable: false,
    terminalMessage: "The package is now government property and has deployed to a classified nebula. Its tour of duty has no estimated return date.",
    mapMode: "drafted",
  },
] as const;

export type MishapResult = OrderMishap;

export function rollMishap(random: () => number = Math.random): MishapResult | null {
  return triggerMishap(false, random);
}

export function triggerMishap(force = false, random: () => number = Math.random): MishapResult | null {
  if (!force && random() >= MISHAP_PROBABILITY) return null;
  const event = MISHAP_EVENTS[Math.floor(random() * MISHAP_EVENTS.length)];
  return {
    ...event,
    type: "courier_mishap",
    triggeredAt: new Date().toISOString(),
    resolvedAt: null,
  };
}
