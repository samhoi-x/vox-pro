import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors mb-8"
        >
          ← 返回首頁
        </Link>
        <h1 className="text-3xl font-black mb-2">🎤 練聲教學部落格</h1>
        <p className="text-gray-500 mb-10">系統性歌唱技巧 · 零基礎友善 · 每週更新</p>

        {posts.length === 0 ? (
          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg mb-2">📝 文章即將上線</p>
            <p className="text-gray-600 text-sm">我哋正準備第一篇文章，請稍後再嚟。</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 hover:border-purple-600/30 transition-colors group"
              >
                <p className="text-xs text-gray-600 mb-2">{post.date}</p>
                <h2 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-[#1a1a24]">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
            ← 返回 Vox Pro 首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

async function getPosts(): Promise<BlogPost[]> {
  const dir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data } = matter(raw);
    posts.push({
      slug: file.replace(".md", ""),
      title: data.title || "Untitled",
      date: data.date || "",
      excerpt: data.excerpt || "",
    });
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}
