/**
 * to parse the format:
 * ---
 * title: This is a title
 * author: this is the author
 * created: 2025-01-01
 * updated: 2025-01-02
 * ---
 * the content
 */

interface Metadata {
  title: string;
  author: string;
  created: string;
  updated: string;
  tags: string[];
}

export default function parseWithMetadata(input: string): {
  metadata: Metadata;
  content: string;
} {
  const match = input.match(/^\s*---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) {
    throw new Error('Invalid format');
  }

  const metadata: Metadata = {
    title: '',
    author: '',
    created: '',
    updated: '',
    tags: [],
  };

  const metadataLines = match[1].split('\n');

  for (const line of metadataLines) {
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey.trim();
    const value = rest.join(':').trim();

    switch (key) {
      case 'title':
        metadata.title = value;
        break;
      case 'author':
        metadata.author = value;
        break;
      case 'created':
        metadata.created = value;
        break;
      case 'updated':
        metadata.updated = value;
        break;
      case 'tags':
        metadata.tags = value.split('|').map((e) => e.trim());
        break;
    }
  }

  const content = input.slice(match[0].length);

  return {
    metadata,
    content,
  };
}
