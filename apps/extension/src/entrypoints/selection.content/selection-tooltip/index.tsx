import { useSetAtom } from 'jotai'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { selectionContentAtom } from './atom'
import { TranslateButton } from './translate-button'

const DOWNWARD_OFFSET_Y = 18
const UPWARD_OFFSET_Y = -10
const MARGIN = 25

export function SelectionTooltip() {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipPositionRef = useRef({ x: 0, y: 0 }) // use ref to avoid re-rendering
  const mouseDownPositionRef = useRef({ x: 0, y: 0 }) // track mousedown position
  const pendingPositionRef = useRef<{ x: number, y: number, isDownwardSelection: boolean } | null>(null) // store pending position calculation
  const previousSelectionTextRef = useRef<string | null>(null)
  const setSelectionContent = useSetAtom(selectionContentAtom)

  // Calculate position after tooltip is rendered
  useLayoutEffect(() => {
    if (isVisible && pendingPositionRef.current && tooltipRef.current) {
      const { x, y, isDownwardSelection } = pendingPositionRef.current
      const tooltipWidth = tooltipRef.current.offsetWidth
      const tooltipHeight = tooltipRef.current.offsetHeight

      // Recalculate x position with actual tooltip width
      const docX = x - tooltipWidth / 2

      // X-axis boundary checking with margin
      const clientWidth = document.documentElement.clientWidth
      const leftBoundary = 0
      const rightBoundary = clientWidth - tooltipWidth - MARGIN

      // Priority: ensure left boundary first, then try to satisfy right boundary
      const finalX = Math.max(leftBoundary, Math.min(rightBoundary, docX))
      let finalY = y
      if (isDownwardSelection) {
        finalY = y + DOWNWARD_OFFSET_Y
      }
      else {
        finalY = y - tooltipHeight + UPWARD_OFFSET_Y
      }

      tooltipPositionRef.current = { x: finalX, y: finalY }

      // Update position immediately
      tooltipRef.current.style.left = `${finalX}px`
      tooltipRef.current.style.top = `${finalY}px`

      pendingPositionRef.current = null
    }
  }, [isVisible])

  useEffect(() => {
    let animationFrameId: number

    const handleMouseUp = (e: MouseEvent) => {
      // check if there is text selected
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim() || ''
      if (selection && selectedText.length > 0 && selectedText !== previousSelectionTextRef.current) {
        previousSelectionTextRef.current = selectedText
        setSelectionContent(selectedText)
        // calculate the position relative to the document
        const scrollY = window.scrollY
        const scrollX = window.scrollX

        const docX = e.clientX + scrollX
        const docY = e.clientY + scrollY
        const isDownwardSelection = e.clientY >= mouseDownPositionRef.current.y

        // Store pending position for useLayoutEffect to process
        pendingPositionRef.current = { x: docX, y: docY, isDownwardSelection }
        setIsVisible(true)
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      // Check if the click target is within the tooltip or its children
      // Use composedPath() to get the full event path including through Shadow DOM boundaries
      if (tooltipRef.current) {
        const eventPath = e.composedPath()
        const isClickInsideTooltip = eventPath.includes(tooltipRef.current)
        if (isClickInsideTooltip) {
          return
        }
      }

      mouseDownPositionRef.current = { x: e.clientX, y: e.clientY }
      setIsVisible(false)
    }

    const handleSelectionChange = () => {
      // if the selected content is cleared, hide the tooltip
      const selection = window.getSelection()
      if (!selection || selection.toString().trim().length === 0) {
        setIsVisible(false)
      }
    }

    const updatePosition = () => {
      if (!isVisible || !tooltipRef.current)
        return

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const tooltipHeight = tooltipRef.current.offsetHeight // calculate height from component

      // calculate strict boundaries
      const topBoundary = scrollY + MARGIN
      const bottomBoundary = scrollY + viewportHeight - tooltipHeight - MARGIN

      // calculate the position of the tooltip, but strictly limit it within the boundaries
      const clampedY = Math.max(topBoundary, Math.min(bottomBoundary, tooltipPositionRef.current.y))

      // also clamp X position to viewport boundaries
      const viewportWidth = document.documentElement.clientWidth
      const tooltipWidth = tooltipRef.current.offsetWidth
      const clampedX = Math.max(MARGIN, Math.min(viewportWidth - tooltipWidth - MARGIN, tooltipPositionRef.current.x))

      // directly operate the DOM, avoid React re-rendering
      tooltipRef.current.style.left = `${clampedX}px`
      tooltipRef.current.style.top = `${clampedY}px`
    }

    const handleScroll = () => {
      // cancel the previous animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      // use requestAnimationFrame to ensure rendering synchronization
      animationFrameId = requestAnimationFrame(updatePosition)
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('selectionchange', handleSelectionChange)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('selectionchange', handleSelectionChange)
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isVisible, setSelectionContent])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={tooltipRef}
      className="absolute z-[2147483647] bg-blue-500 rounded-sm shadow-lg cursor-pointer flex items-center"
      style={{
        left: `${tooltipPositionRef.current.x}px`,
        top: `${tooltipPositionRef.current.y}px`,
      }}
    >
      <TranslateButton />
    </div>
  )
}
