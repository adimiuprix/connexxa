import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
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
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const responseData = {
            ...product,
            tot_review: product.reviews?.length || 0,
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
