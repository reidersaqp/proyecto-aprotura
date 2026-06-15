import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "mock-db.json");

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ announcement: null, slides: [], noticias: [] }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    if (!data.noticias) {
      data.noticias = [];
    }
    return data;
  } catch (err) {
    return { announcement: null, slides: [], noticias: [] };
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write to mock-db.json:", err);
  }
}

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.noticias || []);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    
    // Set noticias. Must be an array.
    db.noticias = Array.isArray(body) ? body : [];
    
    writeDb(db);
    return NextResponse.json({ success: true, data: db.noticias });
  } catch (error) {
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
