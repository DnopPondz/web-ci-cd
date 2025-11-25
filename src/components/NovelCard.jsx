import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NovelCard({ novel }) {
  return (
    <Link href={`/novel/${novel.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{novel.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-60 w-full">
            <Image
              src={novel.coverImage || '/placeholder.svg'}
              alt={novel.title}
              fill
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">{novel.genre}</p>
          <p className="text-sm font-semibold">{novel.author.name}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
