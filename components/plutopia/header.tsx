import { Menu } from 'lucide-react'

interface HeaderProps {
  onSidebarToggle?: () => void
  sidebarOpen?: boolean
}

export function Header({ onSidebarToggle, sidebarOpen }: HeaderProps) {
  return (
    <header className="bg-plutopia-dark border-b border-plutopia-darker px-4 py-4 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <button
          onClick={onSidebarToggle}
          className="text-plutopia-ghost hover:text-white transition-colors"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <Menu size={28} />
        </button>
      </div>
    </header>
  )
}
