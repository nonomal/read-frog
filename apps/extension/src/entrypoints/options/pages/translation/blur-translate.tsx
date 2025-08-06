import type { TranslationNodeStyle } from '@/types/config/provider'
import { i18n } from '#imports'
import deepmerge from 'deepmerge'
import { useAtom } from 'jotai'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { configFields } from '@/utils/atoms/config'
import { TRANSLATION_NODE_STYLE } from '@/utils/constants/translate-node-style'
import { ConfigCard } from '../../components/config-card'

export function BlurTranslate() {
  return (
    <ConfigCard title={i18n.t('options.translation.translationStyle.title')} description={i18n.t('options.translation.translationStyle.description')}>
      <BlurTranslateSelector />
    </ConfigCard>
  )
}

function BlurTranslateSelector() {
  const [translateConfig, setTranslateConfig] = useAtom(configFields.translate)
  const originTranslationNodeStyle = translateConfig.translationNodeStyle

  return (
    <div className="w-full flex justify-start md:justify-end">
      <Select
        value={originTranslationNodeStyle}
        onValueChange={(translationNodeStyle: TranslationNodeStyle) =>
          setTranslateConfig(
            deepmerge(translateConfig, { translationNodeStyle }),
          )}
      >
        <SelectTrigger className="w-40">
          <SelectValue asChild>
            <span>
              {i18n.t(
                `options.translation.translationStyle.style.${originTranslationNodeStyle}`,
              )}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {TRANSLATION_NODE_STYLE.map(nodeStyle => (
              <SelectItem key={nodeStyle} value={nodeStyle}>
                {i18n.t(
                  `options.translation.translationStyle.style.${nodeStyle}`,
                )}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

    </div>

  )
}
