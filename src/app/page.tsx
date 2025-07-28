import fs from 'fs';
import path from 'path';

import parseWithMetadata from '@/helpers/parseWithMetadata';
import Link from 'next/link';

function getGroupedBlogPosts() {
  const postsDir = path.join(process.cwd(), 'docs/blog');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  const list = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const filePath = path.join(postsDir, file);
    const fd = fs.openSync(filePath, 'r');

    const buffer = Buffer.alloc(1024);
    fs.readSync(fd, buffer, 0, buffer.length, 0);
    fs.closeSync(fd);

    const partial = buffer.toString('utf-8');
    const meta = parseWithMetadata(partial).metadata;

    return {
      slug,
      ...meta,
    };
  });

  list.sort((a, b) => b.updated.localeCompare(a.created));

  const grouped: Record<string, typeof list> = {};

  for (const post of list) {
    const key = post.tags[0] || 'Others';

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(post);
  }

  return grouped;
}

export default function Home() {
  try {
    const grouped = getGroupedBlogPosts();
    const tags = Object.keys(grouped);

    return (
      <div className="container p-5 lg:p-10">
        <h1 className="text-3xl mb-10">Next stop: Mars.</h1>

        {tags.map((tag) => (
          <div key={tag} className="mb-8">
            <h2 className="text-sm font-semibold mb-3 text-gray-500">
              {tag.toUpperCase()}
            </h2>
            <ul className="list-disc list-outside ml-5">
              {grouped[tag].map((post) => (
                <li key={post.slug} className="mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                  <span className="ml-3 text-sm text-gray-500">
                    Updated: {post.updated}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  } catch {
    return <div>Error while reading posts</div>;
  }
}
