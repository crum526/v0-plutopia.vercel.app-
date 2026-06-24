interface EmojiProps {
  char?: string
  src?: string
  size?: number
  className?: string
}

export function Emoji({ char, src, size = 20, className = '' }: EmojiProps) {
  // If src is provided, use the image directly
  if (src) {
    return (
      <img
        src={src}
        alt="emoji"
        width={size}
        height={size}
        className={`${className} object-contain bg-transparent`}
        draggable={false}
        style={{ backgroundColor: 'transparent' }}
      />
    )
  }

  // Otherwise, use unicode emoji
  const codepoint = [...(char || '')]
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((cp) => parseInt(cp, 16) !== 0xfe0f) // strip variation selectors
    .join('-')

  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/${codepoint}.png`}
      alt={char}
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  )
}
