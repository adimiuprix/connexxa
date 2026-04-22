'use client';

import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BrandStory = () => {
    return (
        <section className="w-full bg-white">
            <div className="relative w-full h-[600px] md:h-[700px] flex overflow-hidden">
                {/* 3 Panel Logic */}
                <div className="grid grid-cols-1 lg:grid-cols-3 w-full h-full">
                    {/* Panel 1 */}
                    <div className="hidden lg:block relative h-full w-full">
                        <img 
                            src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=800&auto=format&fit=crop" 
                            alt="Adidas Fabric Detail"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Panel 2 */}
                    <div className="relative h-full w-full lg:border-l lg:border-white/10">
                        <img 
                            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop" 
                            alt="Shoe Detail"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Panel 3 */}
                    <div className="hidden lg:block relative h-full w-full lg:border-l lg:border-white/10">
                        <img 
                            src="/brand_story_3.png" 
                            alt="Shoe Side Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Overlay Content */}
                <div className="absolute bottom-12 left-4 md:left-12 z-10 space-y-2">
                    <div className="bg-white px-2 py-0.5 inline-block">
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight adineue-bold text-black italic">
                            HYPERBOOST EDGE
                        </h2>
                    </div>
                    
                    <div className="block">
                        <div className="bg-white px-2 py-0.5 inline-block">
                            <p className="text-xs md:text-sm font-medium text-black">
                                Step into Hyperboost Edge. Now in new colors.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6">
                        <button className="group flex items-center justify-between gap-6 bg-white border border-black px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-200">
                            Men <ArrowForwardIcon sx={{ fontSize: 18 }} className="transform transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="group flex items-center justify-between gap-6 bg-white border border-black px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-200">
                            Women <ArrowForwardIcon sx={{ fontSize: 18 }} className="transform transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="group flex items-center justify-between gap-6 bg-white border border-black px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-200">
                            Learn More <ArrowForwardIcon sx={{ fontSize: 18 }} className="transform transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
