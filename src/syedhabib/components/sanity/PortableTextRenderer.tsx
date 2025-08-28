import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '../../sanity/lib/image'
import { ReactNode } from 'react'
import type { Image as SanityImage } from 'sanity'

interface ImageValue extends SanityImage {
  alt?: string
}

interface CodeValue {
  _type: 'code'
  code: string
  language?: string
  filename?: string
}

interface PortableTextBlockProps {
  children?: ReactNode
}

interface PortableTextMarkProps {
  children?: ReactNode
  value?: {
    href?: string
  }
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => (
      <div className="my-8">
        <Image
          src={urlFor(value).width(800).height(600).url()}
          alt={value.alt || 'Blog image'}
          width={800}
          height={600}
          className="rounded-lg"
        />
        {value.alt && (
          <p className="text-sm text-muted-foreground mt-2 text-center italic">
            {value.alt}
          </p>
        )}
      </div>
    ),
    codeBlock: ({ value }: { value: CodeValue }) => (
      <div className="my-6">
        {value.filename && (
          <div className="bg-gray-800 text-white px-4 py-2 text-sm rounded-t-lg">
            {value.filename}
          </div>
        )}
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">{value.code}</code>
        </pre>
      </div>
    ),
  },
  block: {
    h1: ({ children }: PortableTextBlockProps) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: PortableTextBlockProps) => (
      <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: PortableTextBlockProps) => (
      <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: PortableTextBlockProps) => (
      <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }: PortableTextBlockProps) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: PortableTextBlockProps) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextBlockProps) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }: PortableTextBlockProps) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: PortableTextMarkProps) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: PortableTextMarkProps) => <em className="italic">{children}</em>,
    code: ({ children }: PortableTextMarkProps) => (
      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }: PortableTextMarkProps) => (
      <a
        href={value?.href}
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
}

interface PortableTextRendererProps {
  content: any[]
}

export default function PortableTextRenderer({ content }: PortableTextRendererProps) {
  return <PortableText value={content} components={components} />
}