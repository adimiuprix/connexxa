import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { createClient } from "@/libs/supabaseServer";

/**
 * POST: Toggle item di Wishlist (Tambah jika belum ada, hapus jika sudah ada)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId diperlukan" }, { status: 400 });
    }

    // Pastikan user ada di database Prisma kita
    let dbUser = await prisma.user.findUnique({
      where: { uuid: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          uuid: user.id,
          email: user.email,
        },
      });
    }

    // Cek apakah produk sudah ada di wishlist user ini
    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: dbUser.id,
          productId: Number(productId),
        },
      },
    });

    if (existingWishlist) {
      // Jika sudah ada, hapus (Toggle Off)
      await prisma.wishlist.delete({
        where: { id: existingWishlist.id },
      });
      return NextResponse.json({ 
        message: "Produk dihapus dari Wishlist", 
        action: "removed" 
      });
    } else {
      // Jika belum ada, tambah (Toggle On)
      await prisma.wishlist.create({
        data: {
          userId: dbUser.id,
          productId: Number(productId),
        },
      });
      return NextResponse.json({ 
        message: "Produk berhasil disimpan ke Wishlist", 
        action: "added" 
      });
    }
  } catch (error) {
    console.error("Wishlist API Error:", error);
    return NextResponse.json({ error: "Gagal memproses wishlist" }, { status: 500 });
  }
}

/**
 * GET: Ambil semua wishlist milik user yang sedang login
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { uuid: user.id },
      include: {
        wishlists: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(dbUser?.wishlists || []);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: "Gagal mengambil data wishlist" }, { status: 500 });
  }
}
