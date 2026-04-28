import Carousel from '@/components/Carousel';
import CategoryGrid from '@/components/CategoryGrid';
import Newsletter from '@/components/Newsletter';
import BrandStory from '@/components/BrandStory';
import ProductBox from '@/components/ProductBox';

export const dynamic = 'force-dynamic';

interface DbProduct {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
}

export default async function Home() {
    // Mengambil data dari API Route
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products`, {
        next: { revalidate: 60 } // Cache data selama 60 detik
    });
    const dbProducts = await response.json();

    const products = dbProducts.map((product: DbProduct) => ({
        id: product.id,
        name: product.title || 'Product',
        slug: product.slug,
        category: 'Women',
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
                        {products.map((product: any) => (
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


