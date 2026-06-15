import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, documentoTipo, documentoNumero, email, celular, password } = body;

    if (!nombre || !documentoNumero || !email || !celular || !password) {
      return NextResponse.json({ error: "Faltan campos obligatorios para el registro" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email already exists
    const checkRes = await query("SELECT id FROM usuarios WHERE email = $1", [cleanEmail]);
    if (checkRes.rows.length > 0) {
      return NextResponse.json({ error: "El correo electrónico ya se encuentra registrado" }, { status: 400 });
    }

    // Insert user
    const id = "usr_" + Date.now();
    await query(
      "INSERT INTO usuarios (id, nombre, documento_tipo, documento_numero, email, celular, password) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [id, nombre, documentoTipo || "DNI", documentoNumero, cleanEmail, celular, password]
    );

    return NextResponse.json({ success: true, message: "Usuario registrado con éxito" });
  } catch (error) {
    console.error("Create User API Error:", error);
    return NextResponse.json({ error: "Error en el servidor al intentar registrar el usuario" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, password, newPassword } = body;

    if (!email || !password || !newPassword) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify current password
    const checkRes = await query("SELECT id FROM usuarios WHERE email = $1 AND password = $2", [cleanEmail, password]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 });
    }

    // Update password
    await query("UPDATE usuarios SET password = $1 WHERE email = $2", [newPassword, cleanEmail]);

    return NextResponse.json({ success: true, message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Update User Password API Error:", error);
    return NextResponse.json({ error: "Error en el servidor al intentar cambiar la contraseña" }, { status: 500 });
  }
}
