import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Only process Facebook or fb.watch links to avoid open proxy issues
    const isFacebook = targetUrl.includes("facebook.com") || targetUrl.includes("fb.watch");
    if (!isFacebook) {
      return NextResponse.json({ resolvedUrl: targetUrl });
    }

    // Fetch the URL to resolve redirects
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    let resolvedUrl = response.url || targetUrl;

    // If the resolved URL is still a share link, try to parse the HTML for og:url or canonical
    if (resolvedUrl.includes("/share/") || resolvedUrl.includes("fb.watch")) {
      const html = await response.text();
      
      // Try to find og:url meta tag
      const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i) ||
                         html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:url["']/i);
      
      // Try to find canonical link tag
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) ||
                             html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
                             
      if (ogUrlMatch && ogUrlMatch[1]) {
        resolvedUrl = ogUrlMatch[1];
      } else if (canonicalMatch && canonicalMatch[1]) {
        resolvedUrl = canonicalMatch[1];
      } else {
        // Look for any reel/video patterns in the text
        const reelMatch = html.match(/facebook\.com\/reel\/(\d+)/i) || html.match(/"video_id":"(\d+)"/i);
        if (reelMatch && reelMatch[1]) {
          resolvedUrl = `https://www.facebook.com/reel/${reelMatch[1]}/`;
        }
      }
    }

    return NextResponse.json({ resolvedUrl });
  } catch (error) {
    console.error("Error resolving URL:", error);
    // Return original url on failure as a fallback
    return NextResponse.json({ resolvedUrl: request.url ? new URL(request.url).searchParams.get("url") : "" });
  }
}
