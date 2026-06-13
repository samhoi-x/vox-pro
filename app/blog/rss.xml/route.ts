import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const dynamic = "force-dynamic";

const SITE_URL = "https://vox-pro.tokencheap.net";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

async function getPosts(): Promise<BlogPost[]> {
  const dir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    posts.push({
      slug: file.replace(".md", ""),
      title: data.title || "Untitled",
      date: data.date || "",
      excerpt: data.excerpt || content.slice(0, 200).replace(/[#*\n]/g, ""),
    });
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPosts();

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vox Pro 練聲教學部落格</title>
    <link>${SITE_URL}/blog</link>
    <description>系統性歌唱技巧教學 · 零基礎友善 · 呼吸、音準、共鳴、混聲</description>
    <language>zh-Hant</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
