import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const novels = await prisma.novel.findMany({
    where: { authorId: session.user.id },
  })

  return (
    <main className="container mx-auto px-4">
      <div className="flex justify-between items-center py-8">
        <h1 className="text-3xl font-bold">Your Novels</h1>
        <Link href="/dashboard/novel/new">
          <Button>Create Novel</Button>
        </Link>
      </div>
      <div>
        {novels.map((novel) => (
          <div key={novel.id} className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl">{novel.title}</h2>
            <div>
              <Link href={`/dashboard/novel/${novel.id}`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
