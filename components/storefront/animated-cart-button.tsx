"use client";

import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CART_ANIMATION_EVENT, type CartAnimationDetail } from "@/lib/cart-animation";
import { cn } from "@/lib/utils";

type Flight = CartAnimationDetail & { endX: number; endY: number };

const rarityTreatment = {
  rare: "border-line-strong bg-ink text-page",
  epic: "border-purple bg-purple text-white",
  legendary: "border-gold bg-gold text-white",
};

export function AnimatedCartButton({ count, onOpen }: { count: number; onOpen: () => void }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const controls = useAnimation();
  const reduceMotion = useReducedMotion();

  const catchItem = useCallback(() => {
    void controls.start({
      scale: [1, 1.22, 0.92, 1],
      rotate: [0, -8, 5, 0],
      transition: { duration: reduceMotion ? 0.01 : 0.42, ease: "easeOut" },
    });
  }, [controls, reduceMotion]);

  useEffect(() => {
    function handleCartAdd(event: Event) {
      const detail = (event as CustomEvent<CartAnimationDetail>).detail;
      const target = targetRef.current?.getBoundingClientRect();
      if (!target) return;
      if (reduceMotion) {
        catchItem();
        return;
      }
      setFlights((current) => [
        ...current,
        {
          ...detail,
          endX: target.left + target.width / 2,
          endY: target.top + target.height / 2,
        },
      ]);
    }
    window.addEventListener(CART_ANIMATION_EVENT, handleCartAdd);
    return () => window.removeEventListener(CART_ANIMATION_EVENT, handleCartAdd);
  }, [catchItem, reduceMotion]);

  function completeFlight(id: string) {
    setFlights((current) => current.filter((flight) => flight.id !== id));
    catchItem();
  }

  return (
    <>
      <motion.div animate={controls} ref={targetRef} className="relative">
        <Button variant="ghost" size="icon" className="relative size-11" onClick={onOpen}>
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="absolute right-0 top-0 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-purple px-1 font-mono text-[0.62rem] font-bold text-white"
            >
              {count}
            </motion.span>
          )}
          <span className="sr-only">Open cart with {count} items</span>
        </Button>
      </motion.div>

      <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
        {flights.map((flight) => {
          return (
            <motion.div
              className={cn("fixed grid size-11 place-items-center rounded-xl border shadow-soft", rarityTreatment[flight.rarity])}
              initial={{ x: flight.startX - 22, y: flight.startY - 22, scale: 1, rotate: 0, opacity: 0.95 }}
              animate={{
                x: flight.endX - 22,
                y: flight.endY - 22,
                scale: 0.16,
                rotate: 8,
                opacity: [0.95, 1, 0],
              }}
              transition={{ duration: 0.58, ease: [0.4, 0, 0.2, 1], times: [0, 0.78, 1] }}
              onAnimationComplete={() => completeFlight(flight.id)}
              key={flight.id}
              title={flight.name}
            >
              <Package className="size-4" />
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
