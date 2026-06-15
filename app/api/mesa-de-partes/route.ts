import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Helper to map DB snake_case columns to frontend camelCase keys
function mapRow(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    codigo: row.codigo,
    fecha: row.fecha,
    remitente: row.remitente,
    documentoTipo: row.documento_tipo,
    documentoNumero: row.documento_numero,
    email: row.email,
    celular: row.celular,
    tramiteTipo: row.tramite_tipo,
    asunto: row.asunto,
    mensaje: row.mensaje,
    adjuntoUrl: row.adjunto_url,
    adjuntoNombre: row.adjunto_nombre,
    status: row.status,
  };
}

export async function GET() {
  try {
    const res = await query("SELECT * FROM solicitudes ORDER BY id DESC");
    const mapped = res.rows.map(mapRow);
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Mesa de Partes GET error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const today = new Date();
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    
    // Query count of solicitudes to generate sequential code starting at 20260001
    const countRes = await query("SELECT COUNT(*) as count FROM solicitudes");
    const count = parseInt(countRes.rows[0]?.count || "0", 10);
    const nextSeq = (count + 1).toString().padStart(4, "0");
    const codigoTramite = `2026-${nextSeq}`;
    const id = "sol_" + Date.now();

    await query(
      `INSERT INTO solicitudes (
        id, codigo, fecha, remitente, documento_tipo, documento_numero, 
        email, celular, tramite_tipo, asunto, mensaje, adjunto_url, adjunto_nombre, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        id,
        codigoTramite,
        formattedDate,
        body.remitente,
        body.documentoTipo || "DNI",
        body.documentoNumero,
        body.email,
        body.celular,
        body.tramiteTipo,
        body.asunto,
        body.mensaje,
        body.adjuntoUrl || "",
        body.adjuntoNombre || "",
        "Pendiente",
      ]
    );

    // Retrieve inserted row to return
    const getRes = await query("SELECT * FROM solicitudes WHERE id = $1", [id]);
    return NextResponse.json({ success: true, data: mapRow(getRes.rows[0]) });
  } catch (error) {
    console.error("Mesa de Partes POST error:", error);
    return NextResponse.json({ error: "Error al registrar la solicitud en la base de datos" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 });
    }

    // Update status
    await query("UPDATE solicitudes SET status = $1 WHERE id = $2", [status, id]);

    // Retrieve updated row
    const getRes = await query("SELECT * FROM solicitudes WHERE id = $1", [id]);
    if (getRes.rows.length === 0) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: mapRow(getRes.rows[0]) });
  } catch (error) {
    console.error("Mesa de Partes PUT error:", error);
    return NextResponse.json({ error: "Error al actualizar la solicitud en la base de datos" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID no provisto" }, { status: 400 });
    }

    await query("DELETE FROM solicitudes WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mesa de Partes DELETE error:", error);
    return NextResponse.json({ error: "Error al eliminar la solicitud en la base de datos" }, { status: 500 });
  }
}
