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

        const product = await prisma.product.findUnique({
            where: {
                slug: slug,
            },
            include: {
                sizes: {
                    include: {
                        size: true,
                    },
                },
                reviews: true,
                category: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        let isWishlisted = false;
        if (user) {
            const wishlistEntry = await prisma.wishlist.findUnique({
                where: {
                    userId_productId: {
                        userId: user.id,
                        productId: product.id,
                    },
                },
            });
            isWishlisted = !!wishlistEntry;
        }

        const responseData = {
            ...product,
            tot_review: product.reviews?.length || 0,
            isWishlisted: isWishlisted,
        };

        return NextResponse.json(responseData);
    } catch (error: any) {
        console.error("Detailed error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product", details: error.message },
            { status: 500 }
        );
    }
}
