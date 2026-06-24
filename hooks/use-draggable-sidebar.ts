'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface DraggableSidebarOptions {
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
}

interface DragState {
  isDragging: boolean
  currentX: number
  startX: number
  startY: number
  startTime: number
  directionLocked: 'horizontal' | 'vertical' | null
  sidebarWidth: number
}

export function useDraggableSidebar({ onOpen, onClose, isOpen }: DraggableSidebarOptions) {
  const dragState = useRef<DragState>({
    isDragging: false,
    currentX: 0,
    startX: 0,
    startY: 0,
    startTime: 0,
    directionLocked: null,
    sidebarWidth: 0,
  })

  const [translateX, setTranslateX] = useState(-100)
  const [isDragging, setIsDragging] = useState(false)
  const [bottomNavTranslate, setBottomNavTranslate] = useState(100)
  const [overlayOpacity, setOverlayOpacity] = useState(0)
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isHydrated, setIsHydrated] = useState(false)
  const isFirstRender = useRef(true)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const getSidebarWidth = useCallback(() => {
    if (typeof window === 'undefined') return 280
    const isMobile = window.innerWidth < 640
    return isMobile ? window.innerWidth * 0.85 : 280
  }, [])

  const getMaxTranslate = useCallback(() => {
    return -getSidebarWidth()
  }, [getSidebarWidth])

  const updateVisuals = useCallback(
    (x: number, dragging: boolean, isHorizontalDrag: boolean = false) => {
      const maxTranslate = getMaxTranslate()
      const clampedX = Math.max(maxTranslate, Math.min(0, x))
      const progress = 1 - clampedX / maxTranslate

      setTranslateX(clampedX)
      setIsDragging(dragging)
      setOverlayOpacity(progress)

      // Only update bottom nav if it's an actual horizontal drag
      if (isHorizontalDrag) {
        const navTranslate = (1 - progress) * 100
        setBottomNavTranslate(navTranslate)
      }
    },
    [getMaxTranslate]
  )

  const snap = useCallback(
    (targetX: number) => {
      const maxTranslate = getMaxTranslate()
      const clampedTarget = Math.max(maxTranslate, Math.min(0, targetX))
      const threshold = maxTranslate / 2

      const shouldOpen = clampedTarget > threshold

      if (shouldOpen) {
        onOpen()
        updateVisuals(0, false)
      } else {
        onClose()
        updateVisuals(maxTranslate, false)
      }
    },
    [getMaxTranslate, onOpen, onClose, updateVisuals]
  )

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      const width = getSidebarWidth()

      dragState.current = {
        isDragging: true,
        currentX: isOpen ? 0 : -width,
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        directionLocked: null,
        sidebarWidth: width,
      }

      // Don't update bottom nav visuals on touch start
      setTranslateX(dragState.current.currentX)
      setIsDragging(true)
    },
    [isOpen, getSidebarWidth]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const state = dragState.current
      if (!state.isDragging) return

      const touch = e.touches[0]
      const dx = touch.clientX - state.startX
      const dy = touch.clientY - state.startY

      if (!state.directionLocked) {
        const absDx = Math.abs(dx)
        const absDy = Math.abs(dy)

        if (absDx > 5 || absDy > 5) {
          if (absDx > absDy) {
            state.directionLocked = 'horizontal'
          } else {
            state.directionLocked = 'vertical'
            state.isDragging = false
            setIsDragging(false)
            return
          }
        } else {
          return
        }
      }

      if (state.directionLocked === 'vertical') {
        return
      }

      e.preventDefault()

      const baseX = isOpen ? 0 : -state.sidebarWidth
      const newX = baseX + dx
      state.currentX = newX
      // Only update bottom nav visuals when confirmed horizontal drag
      updateVisuals(newX, true, state.directionLocked === 'horizontal')
    },
    [isOpen, updateVisuals]
  )

  const handleTouchEnd = useCallback(() => {
    const state = dragState.current
    if (!state.isDragging) return

    state.isDragging = false
    setIsDragging(false)

    const elapsed = Date.now() - state.startTime
    const dx = state.currentX - (isOpen ? 0 : -state.sidebarWidth)
    const velocity = elapsed > 0 ? Math.abs(dx) / elapsed : 0

    const maxTranslate = getMaxTranslate()
    const threshold = maxTranslate / 2
    
    // Require minimum 5px swipe distance to trigger action
    const minSwipeDistance = 5
    const absDx = Math.abs(dx)

    const fastSwipe = velocity > 0.4
    const significantSwipe = absDx >= minSwipeDistance

    if (isOpen) {
      if ((dx < threshold && significantSwipe) || fastSwipe) {
        snap(-state.sidebarWidth)
      } else if (significantSwipe) {
        snap(0)
      } else {
        snap(isOpen ? 0 : -state.sidebarWidth)
      }
    } else {
      if ((dx > threshold && significantSwipe) || fastSwipe) {
        snap(0)
      } else if (significantSwipe) {
        snap(-state.sidebarWidth)
      } else {
        snap(-state.sidebarWidth)
      }
    }
  }, [isOpen, getMaxTranslate, snap])

  useEffect(() => {
    // Add a small delay before enabling transitions to prevent initial render glitch
    const timer = setTimeout(() => {
      setIsHydrated(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setSidebarWidth(getSidebarWidth())
    const onResize = () => setSidebarWidth(getSidebarWidth())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [getSidebarWidth])

  useEffect(() => {
    // Skip snap effect on first render to prevent glitch
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!isDragging) {
      const targetX = isOpen ? 0 : getMaxTranslate()
      setTranslateX(targetX)
      setBottomNavTranslate(isOpen ? 0 : 100)
      setOverlayOpacity(isOpen ? 1 : 0)
    }
  }, [isOpen, isDragging, getMaxTranslate])

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    sidebarRef,
    translateX,
    isDragging,
    bottomNavTranslate,
    overlayOpacity,
    sidebarWidth,
    isHydrated,
  }
}
