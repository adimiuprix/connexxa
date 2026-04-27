import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

/**
 * POST: Toggle item di Wishlist (Tambah jika belum ada, hapus jika sudah ada)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userUuid, email } = body;

    if (!productId || !userUuid) {
      return NextResponse.json({ error: "productId dan userUuid diperlukan" }, { status: 400 });
    }

    // Pastikan user ada di database Prisma kita
    let dbUser = await prisma.user.findUnique({
      where: { uuid: userUuid },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          uuid: userUuid,
          email: email || null,
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
  } catch (error: any) {
    console.error("Wishlist API Error DETAILS:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
        body: error
    });
    return NextResponse.json({ 
        error: "Gagal memproses wishlist", 
        details: error.message 
    }, { status: 500 });
  }
}

/**
 * GET: Ambil semua wishlist milik user berdasarkan userUuid
 */
export async function GET(request: NextRequest) {
  try {
    const userUuid = request.nextUrl.searchParams.get("userUuid");

    if (!userUuid) {
      return NextResponse.json({ error: "userUuid diperlukan" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { uuid: userUuid },
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
