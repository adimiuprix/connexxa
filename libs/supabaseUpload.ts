import { createClient } from "./supabaseClient";

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder The folder path within the bucket
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(file: File, bucket: string = "decrodet", folder: string = "products"): Promise<string> {
    const supabase = createClient();
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error("Supabase Upload Error:", error);
        throw new Error(`Gagal mengunggah gambar: ${error.message}`);
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}
