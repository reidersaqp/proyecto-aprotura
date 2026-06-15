import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "mock-db.json");

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ announcement: null, slides: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  } catch (err) {
    return { announcement: null, slides: [] };
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
    return NextResponse.json(db.announcement || null);
  } catch (error) {
    return NextResponse.json(null);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    
    // If body has text, set it. If it is null or empty, set to null.
    if (body && body.text) {
      db.announcement = {
        text: body.text,
        link: body.link || "",
        linkText: body.linkText || "",
      };
    } else {
      db.announcement = null;
    }
    
    writeDb(db);
    return NextResponse.json({ success: true, data: db.announcement });
  } catch (error) {
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
