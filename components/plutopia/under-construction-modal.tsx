import { X, Ghost } from 'lucide-react'

interface UnderConstructionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

export function UnderConstructionModal({ isOpen, onClose, title }: UnderConstructionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-plutopia-dark rounded-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-plutopia-ghost hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          <Ghost size={64} className="text-plutopia-ghost mb-4 opacity-75" />
          <p className="text-center text-plutopia-ghost text-sm">Coming soon.</p>
          <p className="text-center text-gray-400 text-sm mt-2">
            Our team is currently working to get this feature unlocked.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-plutopia-accent hover:bg-plutopia-accentHover text-white font-medium py-2 rounded-lg transition-colors duration-200"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
