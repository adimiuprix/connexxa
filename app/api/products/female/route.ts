import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const products = await prisma.product.findMany({
            where: { gender: "female" },
            orderBy: { createdAt: "desc" },
        });

        let wishlistProductIds: number[] = [];
        if (user) {
            const wishlists = await prisma.wishlist.findMany({
                where: { userId: user.id },
                select: { productId: true },
            });
            wishlistProductIds = wishlists.map((w) => w.productId);
        }

        const productsWithWishlist = products.map((product) => ({
            ...product,
            isWishlisted: wishlistProductIds.includes(product.id),
        }));

        return NextResponse.json(productsWithWishlist);
    } catch (error) {
        console.error("Error fetching female products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
