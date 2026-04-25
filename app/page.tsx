import Carousel from '@/components/Carousel';
import CategoryGrid from '@/components/CategoryGrid';
import Newsletter from '@/components/Newsletter';
import BrandStory from '@/components/BrandStory';
import ProductBox from '@/components/ProductBox';

export default function Home() {
    const products = [
        {
            id: 1,
            name: 'Elegant Dress 1',
            category: 'Women',
            price: 'Rp 2.200.000',
            image: '/product-images/dress1.1.jpg',
            hoverImage: '/product-images/dress1.2.jpg',
        },
        {
            id: 2,
            name: 'Casual Dress 1',
            category: 'Women',
            price: 'Rp 4.000.000',
            image: '/product-images/dress2.1.jpg',
            hoverImage: '/product-images/dress2.2.jpg',
        },
    ];

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


