import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function DELETE(request: NextRequest) {
    try {
        const { sessionId, itemId } = await request.json();

        const cart = await prisma.cart.findUnique({
            where: { sessionId },
            select: { id: true },
        });

        if (!cart) {
            return NextResponse.json(
                { error: "Cart tidak ditemukan" },
                { status: 404 }
            );
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id: Number(itemId),
                cartId: cart.id,
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { error: "Item cart tidak ditemukan" },
                { status: 404 }
            );
        }

        await prisma.cartItem.delete({
            where: { id: cartItem.id },
        });

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        const items = updatedCart?.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return NextResponse.json({
            message: "Item dihapus dari cart",
            items,
            totalItems,
            totalPrice,
        });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return NextResponse.json(
            { error: "Gagal menghapus item dari cart" },
            { status: 500 }
        );
    }
}