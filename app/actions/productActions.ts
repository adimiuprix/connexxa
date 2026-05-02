"use server";

import { createClient } from "@supabase/supabase-js";

// Gunakan SERVICE_ROLE_KEY agar bisa bypass RLS
// Pastikan kunci ini ada di .env Anda!
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);

export async function uploadImageAction(formData: FormData) {
    const file = formData.get("file") as File;
    const bucket = process.env.BUCKET_NAME || "decrodet";

    if (!file) throw new Error("No file provided");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Konversi file ke Buffer (karena di server)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}
