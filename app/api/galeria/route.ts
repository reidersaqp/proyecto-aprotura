import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET - Fetch all gallery items
export async function GET() {
  try {
    const result = await query(
      "SELECT id, titulo, categoria, imagen, descripcion, ubicacion, fecha FROM galeria ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching galeria:", error);
    return NextResponse.json(
      { error: "Error al obtener la galería" },
      { status: 500 }
    );
  }
}

// POST - Add a new gallery item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, categoria, imagen, descripcion, ubicacion, fecha } = body;

    if (!titulo || !categoria || !imagen || !descripcion || !ubicacion || !fecha) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const id = "gal_" + Date.now();

    await query(
      `INSERT INTO galeria (id, titulo, categoria, imagen, descripcion, ubicacion, fecha) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, titulo, categoria, imagen, descripcion, ubicacion, fecha]
    );

    return NextResponse.json({
      success: true,
      data: { id, titulo, categoria, imagen, descripcion, ubicacion, fecha },
    });
  } catch (error) {
    console.error("Error adding galeria item:", error);
    return NextResponse.json(
      { error: "Error al agregar foto a la galería" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a gallery item by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID de la foto" },
        { status: 400 }
      );
    }

    await query("DELETE FROM galeria WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting galeria item:", error);
    return NextResponse.json(
      { error: "Error al eliminar la foto" },
      { status: 500 }
    );
  }
}

// PUT - Update a gallery publication (replacing old items with updated ones)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ids, titulo, categoria, descripcion, ubicacion, fecha, images } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Se requieren los IDs a actualizar" },
        { status: 400 }
      );
    }

    if (!titulo || !categoria || !descripcion || !ubicacion || !fecha || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios y debe haber al menos una imagen" },
        { status: 400 }
      );
    }

    // 1. Delete existing items
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");
    await query(`DELETE FROM galeria WHERE id IN (${placeholders})`, ids);

    // 2. Insert updated items
    const insertedItems = [];
    for (const imgUrl of images) {
      const id = "gal_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      await query(
        `INSERT INTO galeria (id, titulo, categoria, imagen, descripcion, ubicacion, fecha) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, titulo, categoria, imgUrl, descripcion, ubicacion, fecha]
      );
      insertedItems.push({ id, titulo, categoria, imagen: imgUrl, descripcion, ubicacion, fecha });
    }

    return NextResponse.json({
      success: true,
      data: insertedItems,
    });
  } catch (error) {
    console.error("Error updating galeria item:", error);
    return NextResponse.json(
      { error: "Error al actualizar la foto de la galería" },
      { status: 500 }
    );
  }
}
