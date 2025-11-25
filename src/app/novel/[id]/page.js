import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }) {
  const novel = await prisma.novel.findUnique({
    where: { id: params.id },
    include: { author: true },
  })
  return {
    title: `${novel.title} - ${novel.author.name}`,
  }
}

export default async function NovelDetail({ params }) {
  const novel = await prisma.novel.findUnique({
    where: { id: params.id },
    include: { author: true, chapters: { where: { isPublished: true }, orderBy: { order: 'asc' } } },
  })

  return (
    <main className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Image
            src={novel.coverImage || '/placeholder.svg'}
            alt={novel.title}
            width={300}
            height={450}
            className="w-full"
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold">{novel.title}</h1>
          <p className="text-lg text-gray-500 mt-2">by {novel.author.name}</p>
          <p className="mt-4">{novel.description}</p>
          <p className="mt-2 text-sm text-gray-500">Views: {novel.viewCount}</p>
          <Link href={`/read/${novel.id}/${novel.chapters[0]?.id}`}>
            <Button className="mt-4">Start Reading</Button>
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold">Table of Contents</h2>
        <ul>
          {novel.chapters.map((chapter) => (
            <li key={chapter.id} className="mt-4">
              <Link href={`/read/${novel.id}/${chapter.id}`}>
                <span className="text-lg hover:underline">{chapter.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
