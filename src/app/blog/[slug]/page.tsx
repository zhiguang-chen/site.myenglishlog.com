import parseWithMetadata from '@/helpers/parseWithMetadata';
import { promises as fs } from 'fs';
import { notFound } from 'next/navigation';
import markdownit from 'markdown-it';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;

  try {
    const mdString = await fs.readFile(
      process.cwd() + `/docs/blog/${slug}.md`,
      'utf8'
    );

    const { metadata, content } = parseWithMetadata(mdString);
    const { title, author, created, updated } = metadata;
    const md = markdownit();

    return (
      <div className="container p-5 lg:p-10">
        <div className="mb-5">
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            ← Back to Base
          </Link>
        </div>
        <h1 className="font-semibold mb-4 text-2xl sm:text-3xl">{title}</h1>
        <div className="mb-3 text-sm text-gray-500 leading-relaxed sm:mb-5 lg:mb-8">
          Author: {author} <br />
          Created: {created}
          <br />
          Updated: {updated}
        </div>
        <div
          className="prose prose-slate max-w-4xl"
          dangerouslySetInnerHTML={{ __html: md.render(content) }}
        ></div>
      </div>
    );
  } catch {
    notFound();
  }
}
