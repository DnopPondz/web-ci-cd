'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createNovel(data) {
  const novel = await prisma.novel.create({ data })
  revalidatePath('/')
  return novel
}

export async function updateNovel(id, data) {
  const novel = await prisma.novel.update({ where: { id }, data })
  revalidatePath(`/novel/${id}`)
  return novel
}

export async function deleteNovel(id) {
  await prisma.novel.delete({ where: { id } })
  revalidatePath('/')
}

export async function incrementViewCount(id) {
    const novel = await prisma.novel.update({
        where: { id },
        data: {
            viewCount: {
                increment: 1
            }
        }
    })
    return novel
}
