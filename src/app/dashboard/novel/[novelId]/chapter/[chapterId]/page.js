'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { EditorToolbar } from '@/components/EditorToolbar'
import { Button } from '@/components/ui/button'
import { createChapter, updateChapter } from '@/app/actions/chapterActions'
import { uploadImage } from '@/lib/storage'

export default function ChapterEditorPage({ params }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const isNew = params.chapterId === 'new'

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0]
          handleImageUpload(file)
          return true
        }
        return false
      },
    },
  })

  useEffect(() => {
    const draftKey = `draft-chapter-${params.chapterId}`
    const savedDraft = localStorage.getItem(draftKey)
    if (savedDraft) {
      setTimeout(() => {
        setContent(savedDraft)
        editor?.commands.setContent(savedDraft)
      }, 0)
    }
  }, [params.chapterId, editor])

  useEffect(() => {
    const interval = setInterval(() => {
      if (editor) {
        localStorage.setItem(`draft-chapter-${params.chapterId}`, editor.getHTML())
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [editor, params.chapterId])

  const handleImageUpload = async (file) => {
    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
    }
  }

  const onImageUploadClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        handleImageUpload(file)
      }
    }
    input.click()
  }

  const handleSave = async (isPublished) => {
    const data = {
      title: 'Chapter Title', // Placeholder, you'd have a form field for this
      content: content,
      order: 1, // Placeholder
      isPublished: isPublished,
      novelId: params.novelId,
    }
    if (isNew) {
      await createChapter(data)
    } else {
      await updateChapter(params.chapterId, data)
    }
    localStorage.removeItem(`draft-chapter-${params.chapterId}`)
    router.push(`/dashboard/novel/${params.novelId}`)
  }

  return (
    <main className="container mx-auto px-4">
      <div className="py-8">
        <EditorToolbar editor={editor} onImageUpload={onImageUploadClick} />
        <EditorContent editor={editor} className="mt-4 p-4 border rounded-md min-h-[500px]" />
        <div className="mt-4 flex gap-4">
          <Button onClick={() => handleSave(false)}>Save Draft</Button>
          <Button onClick={() => handleSave(true)}>Publish</Button>
        </div>
      </div>
    </main>
  )
}
