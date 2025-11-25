import { NovelCard } from '@/components/NovelCard'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const featuredNovels = await prisma.novel.findMany({
    where: { isPublished: true },
    orderBy: { viewCount: 'desc' },
    take: 4,
    include: { author: true },
  })

  const newNovels = await prisma.novel.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: { author: true },
  })

  return (
    <main className="container mx-auto px-4">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold">Find Your Next Favorite Novel</h1>
        <p className="text-xl text-gray-500 mt-4">
          A new platform for discovering and reading novels from talented authors.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Novels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredNovels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {newNovels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      </section>
    </main>
  )
}
