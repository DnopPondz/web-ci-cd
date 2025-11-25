'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createNovel, updateNovel } from '@/app/actions/novelActions'
import { prisma } from '@/lib/prisma'

export default function NovelForm({ params }) {
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm()
  const [novel, setNovel] = useState(null)
  const isNew = params.id === 'new'

  useEffect(() => {
    if (!isNew) {
      const fetchNovel = async () => {
        const novel = await prisma.novel.findUnique({ where: { id: params.id } })
        setNovel(novel)
        reset(novel)
      }
      fetchNovel()
    }
  }, [isNew, params.id, reset])

  const onSubmit = async (data) => {
    if (isNew) {
      await createNovel(data)
    } else {
      await updateNovel(novel.id, data)
    }
    router.push('/dashboard')
  }

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold py-8">{isNew ? 'Create Novel' : 'Edit Novel'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <Input id="title" {...register('title')} />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <Textarea id="description" {...register('description')} />
        </div>
        <div>
          <label htmlFor="coverImage">Cover Image URL</label>
          <Input id="coverImage" {...register('coverImage')} />
        </div>
        <div>
          <label htmlFor="genre">Genre</label>
          <Input id="genre" {...register('genre')} />
        </div>
        <Button type="submit">{isNew ? 'Create' : 'Update'}</Button>
      </form>

      {!isNew && (
        <div className="mt-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Chapters</h2>
            <Link href={`/dashboard/novel/${novel.id}/chapter/new`}>
              <Button>Create Chapter</Button>
            </Link>
          </div>
          <ul>
            {novel?.chapters.map((chapter) => (
              <li key={chapter.id} className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg">{chapter.title}</h3>
                <div>
                  <Link href={`/dashboard/novel/${novel.id}/chapter/${chapter.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
