import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            const product = await prisma.product.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    category: true,
                    sizes: {
                        include: {
                            size: true
                        }
                    }
                }
            });

            if (!product) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
            }

            return NextResponse.json(product);
        }

        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                category: true
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.title || data.price === undefined) {
            return NextResponse.json({ error: "Missing required fields: title, price" }, { status: 400 });
        }

        const sku = data.sku || `PRD-${Math.floor(Math.random() * 1000000)}`;
        const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

        const product = await prisma.$transaction(async (tx) => {
            let categoryId = data.categoryId ? parseInt(data.categoryId) : null;
            
            if (!categoryId && data.categorySlug) {
                const category = await tx.category.findUnique({
                    where: { slug: data.categorySlug }
                });
                if (category) categoryId = category.id;
            }

            const newProduct = await tx.product.create({
                data: {
                    sku: sku,
                    title: data.title,
                    slug: slug,
                    description: data.description || "",
                    price: parseInt(data.price) || 0,
                    stock: parseInt(data.stock) || 0,
                    images: data.images ? (Array.isArray(data.images) ? data.images : [data.images]) : [],
                    colors: data.colors ? (Array.isArray(data.colors) ? data.colors : [data.colors]) : [],
                    categoryId: categoryId
                }
            });

            if (data.sizes && Array.isArray(data.sizes) && data.sizes.length > 0) {
                const sizeRecords = await tx.size.findMany({
                    where: { value: { in: data.sizes } }
                });

                for (const s of sizeRecords) {
                    await tx.productSize.create({
                        data: {
                            productId: newProduct.id,
                            sizeId: s.id,
                            available: "true"
                        }
                    });
                }
            }

            return newProduct;
        });

        return NextResponse.json(product, { status: 201 });

    } catch (error: any) {
        console.error("Error creating product:", error);
        return NextResponse.json({ 
            error: "Failed to create product", 
            message: error.message
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const data = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const productId = parseInt(id);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Mencari categoryId berdasarkan categorySlug jika ada
            let categoryId = data.categoryId ? parseInt(data.categoryId) : undefined;
            if (!categoryId && data.categorySlug) {
                const category = await tx.category.findUnique({
                    where: { slug: data.categorySlug }
                });
                if (category) categoryId = category.id;
            }

            // 2. Update data dasar produk
            const updateData: any = {};
            if (data.sku) updateData.sku = data.sku;
            if (data.title) updateData.title = data.title;
            if (data.description !== undefined) updateData.description = data.description;
            if (data.price !== undefined) updateData.price = parseInt(data.price) || 0;
            if (data.stock !== undefined) updateData.stock = parseInt(data.stock) || 0;
            if (data.images) updateData.images = data.images;
            if (data.colors) updateData.colors = data.colors;
            if (categoryId !== undefined) updateData.categoryId = categoryId;

            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: updateData
            });

            // 3. Update Varian Ukuran (Hapus yang lama, buat yang baru)
            if (data.sizes && Array.isArray(data.sizes)) {
                // Hapus relasi lama
                await tx.productSize.deleteMany({
                    where: { productId: productId }
                });

                // Cari ID dari ukuran baru
                const sizeRecords = await tx.size.findMany({
                    where: { value: { in: data.sizes } }
                });

                // Buat relasi baru
                for (const s of sizeRecords) {
                    await tx.productSize.create({
                        data: {
                            productId: productId,
                            sizeId: s.id,
                            available: "true"
                        }
                    });
                }
            }

            return updatedProduct;
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error updating product:", error);
        return NextResponse.json({ 
            error: "Failed to update product",
            message: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        await prisma.product.delete({
            where: {
                id: parseInt(id)
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}