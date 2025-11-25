'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createChapter(data) {
  const chapter = await prisma.chapter.create({ data })
  revalidatePath(`/novel/${data.novelId}`)
  return chapter
}

export async function updateChapter(id, data) {
  const chapter = await prisma.chapter.update({ where: { id }, data })
  revalidatePath(`/novel/${chapter.novelId}`)
  return chapter
}

export async function deleteChapter(id) {
    const chapter = await prisma.chapter.findUnique({ where: { id } })
    await prisma.chapter.delete({ where: { id } })
    revalidatePath(`/novel/${chapter.novelId}`)
}
