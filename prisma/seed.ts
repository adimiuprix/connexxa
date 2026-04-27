import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// Setup adapter for Prisma 7
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Supabase Storage Configuration
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || "frumqoxwisgigytdlvlj";
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const BUCKET_NAME = process.env.BUCKET_NAME || "decrodet";

const getPublicUrl = (path: string) => {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/products/${path}`;
};

async function main() {
    console.log("Start seeding...");

    // 1. Create Sizes
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

    // 2. Create Products
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
        },
        {
            sku: "PROD-002",
            title: "Slim Fit Denim Jeans",
            slug: "slim-fit-denim-jeans",
            description: "Classic slim fit denim jeans with a modern touch. Durable and versatile.",
            price: 450000,
            stock: 30,
            images: [
                getPublicUrl("jeans-1.jpg"),
                getPublicUrl("jeans-2.jpg"),
            ],
        },
        {
            sku: "PROD-003",
            title: "Minimalist Leather Backpack",
            slug: "minimalist-leather-backpack",
            description: "Sleek and functional leather backpack for the modern professional.",
            price: 850000,
            stock: 15,
            images: [
                getPublicUrl("backpack-1.jpg"),
                getPublicUrl("backpack-2.jpg"),
            ],
        },
        {
            sku: "PROD-004",
            title: "Wireless Noise-Canceling Headphones",
            slug: "wireless-noise-canceling-headphones",
            description: "Experience pure sound with our latest noise-canceling technology.",
            price: 2500000,
            stock: 20,
            images: [
                getPublicUrl("headphones-1.jpg"),
                getPublicUrl("headphones-2.jpg"),
            ],
        },
        {
            sku: "PROD-005",
            title: "Smart Sports Watch",
            slug: "smart-sports-watch",
            description: "Track your fitness and stay connected with this advanced smart watch.",
            price: 1200000,
            stock: 25,
            images: [
                getPublicUrl("watch-1.jpg"),
                getPublicUrl("watch-2.jpg"),
            ],
        },
    ];

    for (const productData of productsData) {
        const product = await prisma.product.upsert({
            where: { sku: productData.sku },
            update: productData,
            create: productData,
        });

        // 3. Associate with Sizes
        for (const size of sizes) {
            await prisma.productSize.upsert({
                where: {
                    productId_sizeId: {
                        productId: product.id,
                        sizeId: size.id,
                    },
                },
                update: {
                    available: "TRUE",
                },
                create: {
                    productId: product.id,
                    sizeId: size.id,
                    available: "TRUE",
                },
            });
        }
        console.log(`Upserted product: ${product.title} with availability`);
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
