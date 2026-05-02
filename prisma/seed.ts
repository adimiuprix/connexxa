import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";
import crypto from "crypto";

// Setup adapter for Prisma 7
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Supabase Storage Configuration
const NEXT_SUPABASE_PROJECT_ID = process.env.NEXT_SUPABASE_PROJECT_ID;
const SUPABASE_URL = `https://${NEXT_SUPABASE_PROJECT_ID}.supabase.co`;
const BUCKET_NAME = process.env.BUCKET_NAME;

const getPublicUrl = (path: string) => {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/products/${path}`;
};

async function main() {
    console.log("Start seeding...");

    // 1. Create Users
    const usersData = [
        {
            email: "john@example.com",
            name: "John Doe",
            uuid: crypto.randomUUID(),
            phone: "081234567890",
            image: "profile.webp",
        },
        {
            email: "jane@example.com",
            name: "Jane Smith",
            uuid: crypto.randomUUID(),
            phone: "081234567891",
            image: "profile.webp",
        },
        {
            email: "budi@example.com",
            name: "Budi Santoso",
            uuid: crypto.randomUUID(),
            phone: "081234567892",
            image: "profile.webp",
        },
    ];

    const users = [];
    for (const userData of usersData) {
        const user = await prisma.user.upsert({
            where: { email: userData.email || "" },
            update: userData,
            create: userData,
        });
        users.push(user);
        console.log(`Created user: ${user.email} (uuid: ${user.uuid})`);
    }

    // 2. Create Sizes
    const sizesData = [
        { name: "Extra Small", value: "XS" },
        { name: "Small", value: "S" },
        { name: "Medium", value: "M" },
        { name: "Large", value: "L" },
        { name: "Extra Large", value: "XL" },
        { name: "Double Extra Large", value: "2XL" },
    ];

    const sizes = [];
    for (const size of sizesData) {
        const createdSize = await prisma.size.upsert({
            where: { value: size.value },
            update: size,
            create: size,
        });
        sizes.push(createdSize);
        console.log(`Created size: ${createdSize.value}`);
    }

    // 3. Create Categories
    const categoriesData = [
        { name: "Footwear (Sepatu)", slug: "footwear" },
        { name: "Apparel (Pakaian)", slug: "apparel" },
        { name: "Equipment (Peralatan)", slug: "equipment" },
        { name: "Accessories (Aksesoris)", slug: "accessories" },
    ];

    const categories = [];
    for (const category of categoriesData) {
        const createdCategory = await prisma.category.upsert({
            where: { slug: category.slug },
            update: category,
            create: category,
        });
        categories.push(createdCategory);
        console.log(`Created category: ${createdCategory.name}`);
    }

    // 3. Create Products
    const productsData = [
        {
            sku: "PROD-001",
            title: "Premium Cotton T-Shirt",
            slug: "premium-cotton-t-shirt",
            description: "A comfortable and stylish premium cotton t-shirt, perfect for everyday wear.",
            price: 150000,
            stock: 50,
            images: [
                getPublicUrl("t-shirt-1.jpg"),
                getPublicUrl("t-shirt-2.jpg"),
            ],
            // Mengaitkan produk ini dengan kategori Apparel
            categoryId: categories.find(c => c.slug === 'apparel')?.id,
        },
    ];

    for (const productData of productsData) {
        const product = await prisma.product.upsert({
            where: { sku: productData.sku },
            update: productData,
            create: productData,
        });

        // 4. Associate with Sizes
        for (const size of sizes) {
            await prisma.productSize.upsert({
                where: {
                    productId_sizeId: {
                        productId: product.id,
                        sizeId: size.id,
                    },
                },
                update: {
                    available: "true",
                },
                create: {
                    productId: product.id,
                    sizeId: size.id,
                    available: "true",
                },
            });
        }

        // 5. Create Reviews
        const reviewsData = [
            { rating: 5, comment: "Sangat bagus! Bahannya adem.", userId: users[0].id },
            { rating: 4, comment: "Kualitas oke, tapi pengiriman agak lama.", userId: users[1].id },
        ];

        for (const review of reviewsData) {
            await prisma.review.create({
                data: {
                    rating: review.rating,
                    comment: review.comment,
                    productId: product.id,
                    userId: review.userId,
                }
            });
        }

        console.log(`Upserted product: ${product.title} with sizes and reviews`);
    }

    console.log("Seeding finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });
