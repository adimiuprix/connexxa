import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'frumqoxwisgigytdlvlj.supabase.co',
            },
        ],
    },
};

export default nextConfig;
