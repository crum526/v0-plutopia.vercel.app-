interface EmojiProps {
  char: string
  size?: number
  className?: string
}

export function Emoji({ char, size = 20, className = '' }: EmojiProps) {
  const codepoint = [...char]
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
