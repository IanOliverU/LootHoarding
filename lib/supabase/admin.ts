import type { OrderSnapshot } from "@/lib/orders";

type OrderRow = {
  order_number: string;
  tracking_token: string;
  shipping: OrderSnapshot["shipping"];
  items: OrderSnapshot["items"];
  payment_summary: OrderSnapshot["payment"];
  actual_total: number;
  status: OrderSnapshot["status"];
  created_at: string;
};

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? { url: url.replace(/\/$/, ""), serviceRoleKey } : null;
}

export function isSupabaseConfigured() {
  return getConfig() !== null;
}

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getConfig();
  if (!config) throw new Error("Supabase is not configured");

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${detail}`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function insertOrder(order: OrderSnapshot) {
  await adminRequest<void>("orders", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      order_number: order.orderNumber,
      tracking_token: order.trackingToken,
      shipping: order.shipping,
      items: order.items,
      payment_summary: order.payment,
      actual_total: order.actualTotal,
      status: order.status,
      created_at: order.createdAt,
    }),
  });
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderSnapshot | null> {
  if (!isSupabaseConfigured()) return null;
  const encoded = encodeURIComponent(orderNumber);
  const rows = await adminRequest<OrderRow[]>(
    `orders?order_number=eq.${encoded}&select=order_number,tracking_token,shipping,items,payment_summary,actual_total,status,created_at&limit=1`,
  );
  const row = rows[0];
  if (!row) return null;
  return {
    orderNumber: row.order_number,
    trackingToken: row.tracking_token,
    shipping: row.shipping,
    items: row.items,
    payment: row.payment_summary,
    actualTotal: 0,
    status: "confirmed",
    createdAt: row.created_at,
  };
}
