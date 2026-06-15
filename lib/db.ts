import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set in environment variables");
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

let initialized = false;

export async function initDb() {
  if (initialized) return;

  try {
    // Create usuarios table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id VARCHAR(50) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        documento_tipo VARCHAR(20) NOT NULL,
        documento_numero VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        celular VARCHAR(20) NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `);

    // Create solicitudes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS solicitudes (
        id VARCHAR(50) PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        fecha VARCHAR(50) NOT NULL,
        remitente VARCHAR(150) NOT NULL,
        documento_tipo VARCHAR(20) NOT NULL,
        documento_numero VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        celular VARCHAR(20) NOT NULL,
        tramite_tipo VARCHAR(100) NOT NULL,
        asunto VARCHAR(250) NOT NULL,
        mensaje TEXT NOT NULL,
        adjunto_url VARCHAR(250) NOT NULL,
        adjunto_nombre VARCHAR(250) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pendiente'
      );
    `);

    // Create galeria table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS galeria (
        id VARCHAR(50) PRIMARY KEY,
        titulo VARCHAR(250) NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        imagen VARCHAR(500) NOT NULL,
        descripcion TEXT NOT NULL,
        ubicacion VARCHAR(250) NOT NULL,
        fecha VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    // Create contacto_mensajes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacto_mensajes (
        id VARCHAR(50) PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        email VARCHAR(100) NOT NULL,
        telefono VARCHAR(50),
        asunto VARCHAR(250) NOT NULL,
        mensaje TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    // Seed default secure administrator account if not exists
    const checkAdmin = await pool.query("SELECT id FROM usuarios WHERE email = $1", ["administrador@aprotur.pe"]);
    if (checkAdmin.rows.length === 0) {
      const adminId = "usr_admin_default";
      await pool.query(
        "INSERT INTO usuarios (id, nombre, documento_tipo, documento_numero, email, celular, password) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          adminId,
          "Administrador General",
          "DNI",
          "00000000",
          "administrador@aprotur.pe",
          "999999999",
          "AproturArequipa2026!"
        ]
      );
      console.log("Default secure admin user seeded.");
    }

    initialized = true;
    console.log("Database tables checked/created successfully.");
  } catch (error) {
    console.error("Database schema initialization failed:", error);
    throw error;
  }
}

export async function query(text: string, params?: any[]) {
  if (!initialized) {
    await initDb();
  }
  return pool.query(text, params);
}
