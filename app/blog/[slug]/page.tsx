import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <article className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors mb-8"
        >
          ← 返回部落格
        </Link>

        <p className="text-xs text-gray-600 mb-2">{post.date}</p>
        <h1 className="text-3xl font-black mb-8">{post.title}</h1>

        <div
          className="prose prose-invert max-w-none text-gray-300 leading-relaxed
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-purple-400 [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1
            [&_strong]:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-12 bg-[#1a1a24] border border-purple-600/30 rounded-xl p-6 text-center">
          <p className="font-bold mb-2">想系統性學唱歌？</p>
          <p className="text-sm text-gray-400 mb-4">
            18 天循序漸進課程 · 3 日免費試用 · 無需信用卡
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-500 transition-colors"
          >
            免費試用 3 日
          </Link>
        </div>
      </article>
    </div>
  );
}

async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title,
    date: data.date,
    content: markdownToHtml(content),
  };
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])/gm, "<p>")
    .replace(/(?<!<\/[hul]>)$/gm, "</p>")
    .replace(/<p><\/p>/g, "");
}
