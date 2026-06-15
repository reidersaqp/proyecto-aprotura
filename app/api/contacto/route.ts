import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET - Retrieve all contact messages
export async function GET() {
  try {
    const result = await query(
      "SELECT id, nombre, email, telefono, asunto, mensaje, created_at FROM contacto_mensajes ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Error al obtener los mensajes de contacto" },
      { status: 500 }
    );
  }
}

// POST - Submit a new contact message
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, asunto, mensaje } = body;

    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: "Los campos Nombre, Email, Asunto y Mensaje son obligatorios" },
        { status: 400 }
      );
    }

    const id = "msg_" + Date.now();

    await query(
      `INSERT INTO contacto_mensajes (id, nombre, email, telefono, asunto, mensaje) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, nombre, email, telefono || null, asunto, mensaje]
    );

    return NextResponse.json({
      success: true,
      message: "Mensaje guardado con éxito",
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Error interno al enviar el mensaje" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a contact message by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del mensaje para eliminar" },
        { status: 400 }
      );
    }

    await query("DELETE FROM contacto_mensajes WHERE id = $1", [id]);
    return NextResponse.json({ success: true, message: "Mensaje eliminado" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { error: "Error al eliminar el mensaje" },
      { status: 500 }
    );
  }
}
