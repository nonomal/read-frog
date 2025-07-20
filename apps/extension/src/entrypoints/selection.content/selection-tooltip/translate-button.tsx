import { useAtomValue, useSetAtom } from 'jotai'
import { Languages, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { isTooltipVisibleAtom, isTranslatePopoverVisibleAtom, mouseClickPositionAtom, selectionContentAtom } from './atom'

export function TranslateButton() {
  // const selectionContent = useAtomValue(selectionContentAtom)
  const setIsTooltipVisible = useSetAtom(isTooltipVisibleAtom)
  const setIsTranslatePopoverVisible = useSetAtom(isTranslatePopoverVisibleAtom)
  const setMousePosition = useSetAtom(mouseClickPositionAtom)

  const handleClick = (event: React.MouseEvent) => {
    // 获取鼠标点击位置
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left
    const y = rect.top

    // 设置鼠标位置
    setMousePosition({ x, y })

    // 隐藏 tooltip，显示 popover
    setIsTooltipVisible(false)
    setIsTranslatePopoverVisible(true)

    // logger.log('selectionContent', selectionContent)
    // logger.log('Mouse position:', { x, y })
  }

  return (
    <button type="button" className="size-6 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer" onClick={handleClick}>
      <Languages className="size-4" />
      <TranslatePopover />
    </button>
  )
}

export function TranslatePopover() {
  const isVisible = useAtomValue(isTranslatePopoverVisibleAtom)
  const mouseClickPosition = useAtomValue(mouseClickPositionAtom)
  const setIsTranslatePopoverVisible = useSetAtom(isTranslatePopoverVisibleAtom)
  const selectionContent = useAtomValue(selectionContentAtom)
  const popoverRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    setIsTranslatePopoverVisible(false)
  }

  // 点击外部关闭 popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current) {
        const eventPath = event.composedPath()
        const isClickInsideTooltip = eventPath.includes(popoverRef.current)
        if (!isClickInsideTooltip) {
          handleClose()
        }
      }
      // if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      //   handleClose()
      // }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  if (!isVisible || !mouseClickPosition) {
    return null
  }

  return (
    <div
      ref={popoverRef}
      className="fixed z-[9999] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]"
      style={{
        left: mouseClickPosition.x,
        top: mouseClickPosition.y,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">翻译</h3>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
        >
          <X className="size-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            原文
          </label>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded border text-sm text-zinc-800 dark:text-zinc-200">
            {selectionContent || '未选择文本'}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            译文
          </label>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded border text-sm text-zinc-800 dark:text-zinc-200 min-h-[60px]">
            {/* 这里将来可以集成翻译 API */}
            翻译结果将显示在这里...
          </div>
        </div>
      </div>
    </div>
  )
}
