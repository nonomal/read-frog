import { translationNodeStyleSchema } from '@/types/config/provider'
import { globalConfig } from '@/utils/config/config'
import { TRANSLATE_NODE_STYLE_ITEMS } from '@/utils/constants/translate-node-style'

export function decorateTranslationNode(translatedNode: HTMLElement) {
  if (!globalConfig)
    return
  const translationNodeStyle = globalConfig.translate.translationNodeStyle

  const parseConfigStatus = translationNodeStyleSchema.safeParse(translationNodeStyle)
  if (parseConfigStatus.error) {
    throw new Error(parseConfigStatus.error.issues[0].message)
  }
  const { className } = TRANSLATE_NODE_STYLE_ITEMS[translationNodeStyle]
  const classNames = className.trim().split(' ')

  translatedNode.classList.add(...classNames)
}
