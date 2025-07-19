import { useEffect, useRef, useState } from 'react'
import { NOTRANSLATE_CLASS } from '@/utils/constants/dom-labels'
import { cn } from '@/utils/tailwind'

export default function App() {
  return (
    <div className={cn('text-black dark:text-white', NOTRANSLATE_CLASS)}>
      <FloatingDot />
    </div>
  )
}

export function FloatingDot() {
  const [isVisible, setIsVisible] = useState(false)
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })
  const dotRef = useRef<HTMLDivElement>(null)
  const originalPositionRef = useRef({ x: 0, y: 0 }) // 使用 ref 避免重新渲染

  useEffect(() => {
    let animationFrameId: number

    const handleMouseUp = (e: MouseEvent) => {
      // 检查是否有文本被选中
      const selection = window.getSelection()
      if (selection && selection.toString().trim().length > 0) {
        // 计算相对于文档的位置
        const scrollY = window.scrollY
        const scrollX = window.scrollX
        const docX = e.clientX + scrollX + 10 // 右偏移10px
        const docY = e.clientY + scrollY + 10 // 下偏移10px

        // 记录原始位置
        originalPositionRef.current = { x: docX, y: docY }
        setInitialPosition({ x: docX, y: docY })
        setIsVisible(true)
      }
    }

    const handleMouseDown = () => {
      // 鼠标按下时隐藏浮动点
      setIsVisible(false)
    }

    const handleSelectionChange = () => {
      // 如果选中内容被清除，隐藏浮动点
      const selection = window.getSelection()
      if (!selection || selection.toString().trim().length === 0) {
        setIsVisible(false)
      }
    }

    const updatePosition = () => {
      if (!isVisible || !dotRef.current)
        return

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const dotHeight = 16 // 点的高度
      const margin = 10 // 边距

      // 计算严格的边界
      const topBoundary = scrollY + margin
      const bottomBoundary = scrollY + viewportHeight - dotHeight - margin

      // 计算点应该在的位置，但严格限制在边界内
      const clampedY = Math.max(topBoundary, Math.min(bottomBoundary, originalPositionRef.current.y))

      // 直接操作 DOM，避免 React 重新渲染
      dotRef.current.style.left = `${originalPositionRef.current.x}px`
      dotRef.current.style.top = `${clampedY}px`
    }

    const handleScroll = () => {
      // 取消之前的动画帧
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      // 使用 requestAnimationFrame 确保渲染同步
      animationFrameId = requestAnimationFrame(updatePosition)
    }

    // 添加事件监听器
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('selectionchange', handleSelectionChange)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // 清理事件监听器
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('selectionchange', handleSelectionChange)
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={dotRef}
      className="absolute z-[2147483647] w-4 h-4 bg-blue-500 rounded-full shadow-lg cursor-pointer"
      style={{
        left: `${initialPosition.x}px`,
        top: `${initialPosition.y}px`,
      }}
    >
      {/* 可以在这里添加点击事件或其他交互 */}
    </div>
  )
}
