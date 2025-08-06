export const TRANSLATION_NODE_STYLE = ['normal', 'blur'] as const

export const TRANSLATION_NODE_BLUR_ATTRIBUTE = 'read-frog-translation-blur-content'

export const TRANSLATE_NODE_STYLE_ITEMS: Record<typeof TRANSLATION_NODE_STYLE[number], { className: string }> = {
  normal: {
    className: '',
  },
  blur: {
    className: TRANSLATION_NODE_BLUR_ATTRIBUTE,
  },
}
