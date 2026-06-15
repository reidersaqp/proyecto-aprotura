import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "El correo y la contraseña son obligatorios" }, { status: 400 });
    }

    const res = await query("SELECT * FROM usuarios WHERE email = $1 AND password = $2", [
      email.toLowerCase().trim(),
      password,
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
    }

    const user = res.rows[0];
    const { password: _, ...safeUser } = user;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ error: "Error en el servidor al intentar iniciar sesión" }, { status: 500 });
  }
}
