import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        // 1. Verifikasi autentikasi
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Anda harus login untuk melanjutkan checkout." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { sessionId, cartItemIds, shippingInfo, paymentMethod } = body;

        // 2. Validasi input
        if (!sessionId || !cartItemIds || !Array.isArray(cartItemIds) || cartItemIds.length === 0) {
            return NextResponse.json(
                { error: "Data tidak lengkap. Diperlukan: sessionId dan cartItemIds." },
                { status: 400 }
            );
        }

        // 3. Pastikan user sudah ada di tabel Prisma (sync dari Supabase Auth)
        const dbUser = await prisma.user.upsert({
            where: { uuid: user.id },
            update: {
                email: user.email ?? undefined,
            },
            create: {
                uuid: user.id,
                email: user.email ?? null,
                name: user.user_metadata?.full_name ?? null,
            },
        });

        // 4. Ambil cart berdasarkan sessionId
        const cart = await prisma.cart.findUnique({
            where: { sessionId },
            select: { id: true },
        });

        if (!cart) {
            return NextResponse.json(
                { error: "Cart tidak ditemukan." },
                { status: 404 }
            );
        }

        // 5. Ambil CartItems yang akan di-checkout (hanya yang ada di cartItemIds)
        const cartItems = await prisma.cartItem.findMany({
            where: {
                id: { in: cartItemIds.map((id: number) => Number(id)) },
                cartId: cart.id,
            },
        });

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: "Tidak ada item valid yang ditemukan di cart." },
                { status: 404 }
            );
        }

        const OrderHash = await generateRandomString(16, {
            uppercase: true,
            lowercase: true,
            numbers: true,
        });
        const orderNumber = `CNX-${OrderHash}`;


        // 6. Buat Order untuk setiap CartItem
        const createdOrders = await Promise.all(
            cartItems.map((item) =>
                prisma.order.create({
                    data: {
                        userId: dbUser.id,
                        productId: item.productId,
                        size: item.size,
                        color: item.color,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image ?? null,
                        orderHash: orderNumber,
                    },
                })
            )
        );

        // 7. Hapus hanya CartItem yang sudah di-checkout
        await prisma.cartItem.deleteMany({
            where: {
                id: { in: cartItems.map((item) => item.id) },
            },
        });

        return NextResponse.json({
            success: true,
            orderNumber,
            orderIds: createdOrders.map((o) => o.id),
            itemsOrdered: cartItems.length,
        });

    } catch (error: any) {
        console.error("Order API Error:", error);
        return NextResponse.json(
            {
                error: "Gagal memproses pesanan.",
                details: error.message,
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const dbUser = await prisma.user.findUnique({
            where: { uuid: user.id },
            select: { id: true },
        });

        if (!dbUser) {
            return NextResponse.json([]);
        }

        const orders = await prisma.order.findMany({
            where: { userId: dbUser.id },
            include: {
                product: {
                    select: { title: true, slug: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error("Order GET Error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data pesanan.", details: error.message },
            { status: 500 }
        );
    }
}

async function generateRandomString(
    length: number,
    options?: {
        uppercase?: boolean;
        lowercase?: boolean;
        numbers?: boolean;
    }
): Promise<string> {
    let chars = '';
    if (options?.uppercase !== false) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options?.lowercase !== false) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options?.numbers !== false) chars += '0123456789';

    if (!chars) throw new Error('At least one character type must be enabled');

    // Rejection sampling — buang byte yang menyebabkan bias
    const maxValid = Math.floor(256 / chars.length) * chars.length;
    const result: string[] = [];

    while (result.length < length) {
        const needed = length - result.length;
        const bytes = crypto.randomBytes(needed * 2); // buffer lebih besar untuk efisiensi

        for (const byte of bytes) {
            if (result.length >= length) break;
            if (byte < maxValid) {
                result.push(chars[byte % chars.length]);
            }
            // byte >= maxValid → dibuang, tidak dipakai
        }
    }

    return result.join('');
}