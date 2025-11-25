'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReaderSettings } from '@/components/ReaderSettings'
import { Button } from '@/components/ui/button'
import { incrementViewCount } from '@/app/actions/novelActions'

export default function ReadingPage({ params }) {
  const [theme, setTheme] = useState('light')
  const [fontSize, setFontSize] = useState(16)
  const router = useRouter()

  // In a real app, you'd fetch the chapter and novel data here
  // For now, we'll use mock data
  const chapter = {
    id: params.chapterId,
    title: 'Chapter 1',
    content: '<p>This is the content of the chapter.</p>',
    order: 1,
  }
  const novel = {
    id: params.novelId,
    chapters: [{ id: '1', order: 1 }, { id: '2', order: 2 }],
  }

  useEffect(() => {
    incrementViewCount(params.novelId)
  }, [params.novelId])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
  }

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize)
  }

  const navigateChapter = (direction) => {
    const currentChapterIndex = novel.chapters.findIndex((c) => c.id === chapter.id)
    const nextChapter = novel.chapters[currentChapterIndex + direction]
    if (nextChapter) {
      router.push(`/read/${novel.id}/${nextChapter.id}`)
    }
  }

  return (
    <div className={`theme-${theme}`}>
      <ReaderSettings
        onThemeChange={handleThemeChange}
        onFontSizeChange={handleFontSizeChange}
      />
      <main
        className="prose mx-auto py-20"
        style={{ fontSize: `${fontSize}px`, userSelect: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <h1 className="text-4xl font-bold mb-8">{chapter?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: chapter?.content }} />
      </main>
      <div className="flex justify-between mt-8">
        <Button onClick={() => navigateChapter(-1)}>Previous Chapter</Button>
        <Button onClick={() => navigateChapter(1)}>Next Chapter</Button>
      </div>
    </div>
  )
}
