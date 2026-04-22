import Carousel from '@/components/Carousel';
import CategoryGrid from '@/components/CategoryGrid';
import ProductScroller from '@/components/ProductScroller';
import Newsletter from '@/components/Newsletter';
import BrandStory from '@/components/BrandStory';

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Carousel />
            <CategoryGrid />
            <ProductScroller title="PRODUK YANG TERBARU" />
            <ProductScroller title="RILISAN TERBARU" />
            <BrandStory />
            <Newsletter />
        </main>
    );
}


