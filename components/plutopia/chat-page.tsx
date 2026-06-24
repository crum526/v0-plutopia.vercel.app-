'use client'

import { useState, useRef } from 'react'
import { Plus, Smile } from 'lucide-react'
import { ChatMessage } from './chat-message'
import { EmojiPickerModal } from './emoji-picker-modal'
import { Emoji } from './emoji'

interface Message {
  id: string
  text: string
  images: string[]
  timestamp: Date
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setSelectedImages((prev) => [...prev, event.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSendMessage = () => {
    if (inputText.trim() || selectedImages.length > 0) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        images: selectedImages,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      setInputText('')
      setSelectedImages([])
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-plutopia-darker text-white">
      {/* Chat Header */}
      <div className="border-b border-plutopia-dark px-4 py-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-plutopia-accent">#</span>
          Living Room
        </h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-plutopia-ghost">
            <div className="text-center">
              <p className="text-lg mb-2">Welcome to Living Room</p>
              <p className="text-sm">Start a conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Area */}
      {selectedImages.length > 0 && (
        <div className="px-4 py-3 border-t border-plutopia-dark bg-plutopia-darker/50">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img src={image} alt="preview" className="h-20 w-20 rounded object-cover" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-plutopia-dark px-4 py-3 bg-plutopia-darker">
        <div className="flex items-center gap-3">
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-plutopia-ghost hover:text-plutopia-accent transition-colors flex-shrink-0"
            aria-label="Add attachment"
          >
            <Plus size={24} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleAddImage}
            className="hidden"
            aria-label="Image input"
          />

          {/* Message Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message #Living Room..."
            className="flex-1 bg-plutopia-dark border border-plutopia-dark rounded px-3 py-2 text-white placeholder-plutopia-ghost focus:outline-none focus:border-plutopia-accent"
          />

          {/* Emoji Picker Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-plutopia-ghost hover:text-plutopia-accent transition-colors flex-shrink-0"
            aria-label="Emoji picker"
          >
            <Smile size={24} />
          </button>
        </div>
      </div>

      {/* Emoji Picker Modal */}
      {showEmojiPicker && <EmojiPickerModal onSelectEmoji={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />}
    </div>
  )
}
