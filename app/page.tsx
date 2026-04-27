import Carousel from '@/components/Carousel';
import CategoryGrid from '@/components/CategoryGrid';
import Newsletter from '@/components/Newsletter';
import BrandStory from '@/components/BrandStory';
import ProductBox from '@/components/ProductBox';

import prisma from '@/libs/prisma';

export default async function Home() {
    const dbProducts = await prisma.product.findMany({
        take: 10,
        orderBy: {
            createdAt: 'desc',
        },
    });

    const products = dbProducts.map((product) => ({
        id: product.id,
        name: product.title,
        category: 'Women', // Default category since it's not in the model yet
        price: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(product.price),
        image: product.images[0] || '/placeholder.jpg',
        hoverImage: product.images[1] || null,
    }));

    return (
        <main className="min-h-screen bg-white">
            <Carousel />
            <CategoryGrid />

            <section className="py-16 overflow-hidden">
                <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                    <h2 className="text-3xl md:text-4xl font-black italic mb-8 tracking-tighter uppercase text-black">
                        PRODUK YANG TERBARU
                    </h2>
                    <div className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide">
                        {products.map((product) => (
                            <ProductBox key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            <BrandStory />
            <Newsletter />
        </main>
    );
}


