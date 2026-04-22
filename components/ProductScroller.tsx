'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const products = [
    {
        id: 1,
        name: 'Samba OG Shoes',
        category: 'Originals',
        price: 'Rp 2.200.000',
        image: 'https://images.adidas.com/is/image/adidas/B75806_01_standard.jpg?resMode=sharp&width=300&height=300',
    },
    {
        id: 2,
        name: 'Gazelle Bold Shoes',
        category: 'Originals',
        price: 'Rp 2.500.000',
        image: 'https://images.adidas.com/is/image/adidas/H06259_01_standard.jpg?resMode=sharp&width=300&height=300',
    },
    {
        id: 3,
        name: 'Predator Elite FG',
        category: 'Football',
        price: 'Rp 4.000.000',
        image: 'https://images.adidas.com/is/image/adidas/IG5453_01_standard.jpg?resMode=sharp&width=300&height=300',
    },
    {
        id: 4,
        name: 'Ultraboost Light',
        category: 'Running',
        price: 'Rp 3.300.000',
        image: 'https://images.adidas.com/is/image/adidas/HQ6339_01_standard.jpg?resMode=sharp&width=300&height=300',
    },
    {
        id: 5,
        name: 'Stan Smith Classic',
        category: 'Originals',
        price: 'Rp 1.800.000',
        image: 'https://images.adidas.com/is/image/adidas/FX5502_01_standard.jpg?resMode=sharp&width=300&height=300',
    },
];

const ProductBox = ({ product }: { product: typeof products[0] }) => {
    return (
        <div className="min-w-[280px] md:min-w-[320px] bg-white group cursor-pointer border border-transparent hover:border-gray-200 transition-all p-2">
            <div className="aspect-square relative overflow-hidden bg-[#ebedee]">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </div>
            </div>
            <div className="mt-4 space-y-1">
                <h3 className="text-sm font-semibold uppercase tracking-tight">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.category}</p>
                <p className="text-sm font-bold">{product.price}</p>
            </div>
        </div>
    );
};

const ProductScroller = ({ title }: { title: string }) => {
    return (
        <section className="py-16 overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-20">
                <h2 className="text-3xl md:text-4xl font-black italic mb-8 tracking-tighter uppercase text-black">
                    {title}
                </h2>
                <div className="flex space-x-4 overflow-x-auto pb-8 scrollbar-hide">
                    {products.map((product) => (
                        <ProductBox key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductScroller;
