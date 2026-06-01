"use client";

import Image from 'next/image';

interface CartPreviewItem {
    id: number;
    title: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image?: string | null;
}

interface CartPreviewProps {
    isOpen: boolean;
    isLoading: boolean;
    items: CartPreviewItem[];
    totalItems: number;
    totalPrice: number;
    removingItemId: number | null;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onRemoveItem: (itemId: number) => void;
    onCartClick: () => void;
    formatCurrency: (amount: number) => string;
    cartCount: number;
}

import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const CartPreview = ({
    isOpen,
    isLoading,
    items,
    totalItems,
    totalPrice,
    removingItemId,
    onMouseEnter,
    onMouseLeave,
    onRemoveItem,
    onCartClick,
    formatCurrency,
    cartCount,
}: CartPreviewProps) => {
    return (
        <div
            className="relative"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onCartClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="relative p-1 hover:bg-gray-100 rounded-sm transition-colors cursor-pointer">
                <ShoppingBagOutlinedIcon sx={{ fontSize: 24 }} />
                <span className="absolute -bottom-1 -right-1 bg-[#0071ae] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                </span>
            </div>

            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] max-w-[360px] bg-white border border-gray-200 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] z-50">
                    {/* Bridge to prevent hover gap */}
                    <div className="absolute inset-x-0 -top-3 h-3" />

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-black">Tas Belanja</p>
                            <p className="text-[11px] text-gray-500 mt-1">{totalItems} item di tas</p>
                        </div>
                        <span className="text-[11px] font-bold text-black">{formatCurrency(totalPrice)}</span>
                    </div>

                    {/* Items */}
                    <div className="max-h-[360px] overflow-y-auto">
                        {isLoading ? (
                            <div className="px-4 py-10 text-center text-[11px] font-bold uppercase tracking-widest text-gray-500 animate-pulse">
                                Memuat tas...
                            </div>
                        ) : items.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-black">Tas masih kosong</p>
                                <p className="text-[11px] text-gray-500 mt-2">Tambah produk untuk mulai belanja.</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0 flex gap-3">
                                    <div className="relative w-16 h-16 flex-shrink-0 bg-[#ebedee] overflow-hidden">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-[11px] font-bold uppercase tracking-wide text-black truncate">
                                                {item.title}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRemoveItem(item.id);
                                                }}
                                                disabled={removingItemId === item.id}
                                                className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-4 hover:no-underline disabled:text-gray-400 disabled:no-underline"
                                            >
                                                {removingItemId === item.id ? 'Proses...' : 'Hapus'}
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-gray-500 mt-1">
                                            Ukuran {item.size} • {item.color}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between gap-3">
                                            <span className="text-[11px] text-gray-500">Qty {item.quantity}</span>
                                            <span className="text-[11px] font-bold text-black">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer total */}
                    {!isLoading && items.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-widest text-black">Total</span>
                            <span className="text-[12px] font-black text-black">{formatCurrency(totalPrice)}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartPreview;
