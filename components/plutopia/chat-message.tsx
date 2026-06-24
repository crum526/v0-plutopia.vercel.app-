interface Message {
  id: string
  text: string
  images: string[]
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="space-y-2">
      {/* Images */}
      {message.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {message.images.map((image, index) => (
            <img key={index} src={image} alt="message" className="rounded max-w-full h-auto" />
          ))}
        </div>
      )}

      {/* Message Text */}
      {message.text && (
        <div className="flex items-end gap-2">
          <div className="bg-plutopia-dark rounded-lg px-3 py-2 max-w-xs md:max-w-md">
            <p className="text-white text-sm break-words">{message.text}</p>
          </div>
          <span className="text-plutopia-ghost text-xs">{formatTime(message.timestamp)}</span>
        </div>
      )}
    </div>
  )
}
