'use client';

export const CART_SESSION_KEY = 'cart_session_id';
export const CART_SYNC_EVENT = 'connexxa:cart-updated';
export const CART_SYNC_CHANNEL = 'connexxa-cart';
export const CART_SYNC_STORAGE_KEY = 'connexxa:cart-sync';

export interface CartSyncDetail {
  sessionId?: string
  totalItems?: number
}

export const dispatchCartSync = (detail: CartSyncDetail) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(CART_SYNC_EVENT, { detail }));

  localStorage.setItem(
    CART_SYNC_STORAGE_KEY,
    JSON.stringify({
      ...detail,
      at: Date.now(),
    }),
  );

  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(CART_SYNC_CHANNEL);
    channel.postMessage(detail);
    channel.close();
  }
};
