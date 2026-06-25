import { Menu } from 'lucide-react'

interface HeaderProps {
  onSidebarToggle?: () => void
  sidebarOpen?: boolean
}

export function Header({ onSidebarToggle, sidebarOpen }: HeaderProps) {
  return (
    <header className="bg-plutopia-dark border-b border-plutopia-darker px-4 sticky top-0 z-40" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))', paddingBottom: '0.5rem' }}>
      <div className="max-w-2xl mx-auto flex items-center justify-between h-12">
        <button
          onClick={onSidebarToggle}
          className="md:hidden text-plutopia-ghost hover:text-white transition-colors touch-manipulation"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  )
}
