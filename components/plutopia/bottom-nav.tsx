import { Users, ShoppingBag, User } from 'lucide-react'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  translateY?: number
}

export function BottomNav({ activeTab, onTabChange, translateY = 0 }: BottomNavProps) {
  const tabs = [
    
    { id: 'chat', label: 'Chat', icon: Users },
    { id: 'notifications', label: 'Inbox', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-plutopia-darker border-t border-plutopia-dark px-0 py-3 safe-area-inset-bottom z-[60]"
      style={{
        transform: `translateY(${translateY}px)`,
        transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        willChange: 'transform',
      }}
    >
      <div className="flex justify-around items-center max-w-2xl mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
              activeTab === id ? 'text-plutopia-accent' : 'text-plutopia-ghost hover:text-gray-400'
            }`}
            aria-label={label}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon size={24} strokeWidth={1.5} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
