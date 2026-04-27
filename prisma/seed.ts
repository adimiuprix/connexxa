import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// Setup adapter for Prisma 7
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Supabase Storage Configuration
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const BUCKET_NAME = process.env.BUCKET_NAME;

const getPublicUrl = (path: string) => {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/products/${path}`;
};

async function main() {
    console.log("Start seeding...");

    const products = [
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

    for (const product of products) {
        const upsertedProduct = await prisma.product.upsert({
            where: { sku: product.sku },
            update: product,
            create: product,
        });
        console.log(`Upserted product: ${upsertedProduct.title}`);
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
