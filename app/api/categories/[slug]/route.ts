import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const category = await prisma.category.findUnique({
            where: { slug },
            select: { id: true, name: true, slug: true },
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const products = await prisma.product.findMany({
            where: { categoryId: category.id },
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

        return NextResponse.json({ category, products: productsWithWishlist });
    } catch (error) {
        console.error("Error fetching category products:", error);
        return NextResponse.json(
            { error: "Failed to fetch category products" },
            { status: 500 }
        );
    }
}
