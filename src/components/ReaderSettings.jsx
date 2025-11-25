'use client'

import { useState } from 'react'
import { Sun, Moon, Book, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ReaderSettings({ onThemeChange, onFontSizeChange }) {
  const [theme, setTheme] = useState('light')
  const [fontSize, setFontSize] = useState(16)

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    onThemeChange(newTheme)
  }

  const handleFontSizeChange = (increment) => {
    const newSize = fontSize + increment
    setFontSize(newSize)
    onFontSizeChange(newSize)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Book className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleThemeChange('light')}>
            <Sun className="mr-2 h-4 w-4" /> Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
            <Moon className="mr-2 h-4 w-4" /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange('sepia')}>
            <Book className="mr-2 h-4 w-4" /> Sepia
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button onClick={() => handleFontSizeChange(2)} size="sm">
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="mx-2">{fontSize}px</span>
            <Button onClick={() => handleFontSizeChange(-2)} size="sm">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
