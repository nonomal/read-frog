import type { TextUIPart } from 'ai'
import { readUIMessageStream, streamText } from 'ai'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Languages, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Spinner } from '@/components/tranlation/spinner'
import { ISO6393_TO_6391, LANG_CODE_TO_EN_NAME } from '@/types/config/languages'
import { isPureTranslateProvider } from '@/types/config/provider'
import { globalConfig } from '@/utils/config/config'
import { googleTranslate, microsoftTranslate } from '@/utils/host/translate/api'
import { getTranslatePrompt } from '@/utils/prompts/translate'
import { getTranslateModel } from '@/utils/provider'
import { isTooltipVisibleAtom, isTranslatePopoverVisibleAtom, mouseClickPositionAtom, selectionContentAtom } from './atom'

export function TranslateButton() {
  // const selectionContent = useAtomValue(selectionContentAtom)
  const setIsTooltipVisible = useSetAtom(isTooltipVisibleAtom)
  const setIsTranslatePopoverVisible = useSetAtom(isTranslatePopoverVisibleAtom)
  const setMousePosition = useSetAtom(mouseClickPositionAtom)

  const handleClick = async (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left
    const y = rect.top

    // const model = await getTranslateModel('openai', 'gpt-4o-mini')
    // const result = streamText({
    //   model,
    //   prompt: 'Write a short story about a robot.',
    // })

    // for await (const uiMessage of readUIMessageStream({
    //   stream: result.toUIMessageStream(),
    // })) {
    //   console.log('Current message state:', uiMessage)
    // }

    setMousePosition({ x, y })
    setIsTooltipVisible(false)
    setIsTranslatePopoverVisible(true)
  }

  return (
    <button type="button" className="size-6 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer" onClick={handleClick}>
      <Languages className="size-4" />
    </button>
  )
}

export function TranslatePopover() {
  const [isVisible, setIsVisible] = useAtom(isTranslatePopoverVisibleAtom)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState<string | undefined>(undefined)
  const mouseClickPosition = useAtomValue(mouseClickPositionAtom)
  const selectionContent = useAtomValue(selectionContentAtom)
  const popoverRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTranslatedText(undefined)
  }, [setIsVisible])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current) {
        const eventPath = event.composedPath()
        const isClickInsideTooltip = eventPath.includes(popoverRef.current)
        if (!isClickInsideTooltip) {
          handleClose()
        }
      }
    }

    const translate = async () => {
      if (!selectionContent) {
        return
      }

      if (!globalConfig) {
        throw new Error('No global config when translate text')
      }
      const provider = globalConfig.translate.provider
      const modelConfig = globalConfig.translate.models[provider]
      if (!modelConfig && !isPureTranslateProvider(provider)) {
        throw new Error(`No configuration found for provider: ${provider}`)
      }
      const modelString = modelConfig?.isCustomModel ? modelConfig.customModel : modelConfig?.model

      setIsTranslating(true)
      if (isPureTranslateProvider(provider)) {
        const sourceLang = globalConfig.language.sourceCode === 'auto' ? 'auto' : (ISO6393_TO_6391[globalConfig.language.sourceCode] ?? 'auto')
        const targetLang = ISO6393_TO_6391[globalConfig.language.targetCode]
        if (!targetLang) {
          throw new Error('Invalid target language code')
        }
        if (provider === 'google') {
          setTranslatedText(await googleTranslate(selectionContent, sourceLang, targetLang))
        }
        else if (provider === 'microsoft') {
          setTranslatedText(await microsoftTranslate(selectionContent, sourceLang, targetLang))
        }
      }
      else if (modelString) {
        const targetLang = LANG_CODE_TO_EN_NAME[globalConfig.language.targetCode]
        if (!targetLang) {
          throw new Error('Invalid target language code')
        }
        const prompt = getTranslatePrompt(targetLang, selectionContent)
        const model = await getTranslateModel(provider, modelString)
        const result = streamText({
          model,
          prompt,
        })
        for await (const uiMessage of readUIMessageStream({
          stream: result.toUIMessageStream(),
        })) {
          setTranslatedText((uiMessage.parts[uiMessage.parts.length - 1] as TextUIPart).text)
        }
      }

      setIsTranslating(false)
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      translate()
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, selectionContent, handleClose])

  if (!isVisible || !mouseClickPosition) {
    return null
  }

  return (
    <div
      ref={popoverRef}
      className="fixed z-[2147483647] bg-white dark:bg-zinc-800 border rounded-xl w-[300px]"
      style={{
        left: mouseClickPosition.x,
        top: mouseClickPosition.y,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <svg viewBox="0 0 16 16" fill="#000000" xmlns="http://www.w3.org/2000/svg" id="Translate--Streamline-Remix" height="16" width="16">
            <desc>
              Translate Streamline Icon: https://streamlinehq.com
            </desc>
            <path d="M3.333333333333333 10v1.3333333333333333c0 0.7029333333333333 0.54392 1.2788 1.2338266666666666 1.3296666666666666L4.666666666666666 12.666666666666666h2v1.3333333333333333H4.666666666666666c-1.47276 0 -2.6666666666666665 -1.1939333333333333 -2.6666666666666665 -2.6666666666666665v-1.3333333333333333h1.3333333333333333Zm8.666666666666666 -3.333333333333333 2.9333333333333336 7.333333333333333h-1.4366666666666665l-0.8006666666666666 -2h-2.7266666666666666l-0.7993333333333333 2h-1.436L10.666666666666666 6.666666666666666h1.3333333333333333Zm-0.6666666666666666 1.9234666666666667L10.501999999999999 10.666666666666666h1.6613333333333333L11.333333333333332 8.590133333333332ZM5.333333333333333 1.3333333333333333v1.3333333333333333h2.6666666666666665v4.666666666666666H5.333333333333333v2H4v-2H1.3333333333333333V2.6666666666666665h2.6666666666666665V1.3333333333333333h1.3333333333333333Zm6 0.6666666666666666c1.4727333333333332 0 2.6666666666666665 1.1939066666666664 2.6666666666666665 2.6666666666666665v1.3333333333333333h-1.3333333333333333V4.666666666666666c0 -0.73638 -0.5969333333333333 -1.3333333333333333 -1.3333333333333333 -1.3333333333333333h-2V2h2ZM4 4H2.6666666666666665v2h1.3333333333333333V4Zm2.6666666666666665 0H5.333333333333333v2h1.3333333333333333V4Z" stroke-width="0.6667"></path>
          </svg>
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Translation</h3>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
        >
          <X className="size-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Original
          </label>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded border text-sm text-zinc-800 dark:text-zinc-200">
            {selectionContent || 'No text selected'}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Translation
          </label>
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded border text-sm text-zinc-800 dark:text-zinc-200 min-h-[60px]">
            {translatedText || 'Translation result will be displayed here...'}
            {' '}
            {isTranslating && <Spinner />}
          </div>
        </div>
      </div>
    </div>
  )
}
