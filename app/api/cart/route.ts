import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// GET: Ambil cart berdasarkan sessionId
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId diperlukan" }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ cart: null, items: [], totalItems: 0, totalPrice: 0 });
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      cart,
      items: cart.items,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Gagal mengambil data cart" }, { status: 500 });
  }
}

// POST: Tambah item ke cart (buat cart jika belum ada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, productId, title, size, color, price, quantity = 1, image } = body;

    if (!sessionId || !productId || !title || !size || !color || !price) {
      return NextResponse.json(
        { error: "Data tidak lengkap. Diperlukan: sessionId, productId, title, size, color, price" },
        { status: 400 }
      );
    }

    // Cari atau buat cart
    let cart = await prisma.cart.findUnique({
      where: { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionId,
          currency: "IDR",
        },
      });
    }

    // Cek apakah item dengan kombinasi yang sama sudah ada
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size,
          color,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      // Update quantity jika sudah ada
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Buat item baru
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          title,
          size,
          color,
          price,
          quantity,
          image,
        },
      });
    }

    // Ambil cart lengkap dengan items
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    const totalItems = updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedCart!.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      message: existingItem ? "Jumlah item diperbarui" : "Item ditambahkan ke cart",
      cartItem,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Gagal menambahkan ke cart" }, { status: 500 });
  }
}

// DELETE: Hapus item dari cart berdasarkan sessionId dan itemId
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, itemId } = body;

    if (!sessionId || !itemId) {
      return NextResponse.json(
        { error: "Data tidak lengkap. Diperlukan: sessionId dan itemId" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      select: { id: true },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart tidak ditemukan" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(itemId),
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Item cart tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const items = updatedCart?.items || [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      message: "Item dihapus dari cart",
      items,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Gagal menghapus item dari cart" },
      { status: 500 }
    );
  }
}
