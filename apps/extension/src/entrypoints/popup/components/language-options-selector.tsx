import type {
  LangCodeISO6393,
} from '@/types/config/languages'
import { i18n } from '#imports'
import { Icon } from '@iconify/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'
import { useAtom } from 'jotai'
import {
  LANG_CODE_TO_EN_NAME,
  LANG_CODE_TO_LOCALE_NAME,
  langCodeISO6393Schema,
} from '@/types/config/languages'
import { configFields } from '@/utils/atoms/config'

function langCodeLabel(langCode: LangCodeISO6393) {
  return `${LANG_CODE_TO_EN_NAME[langCode]} (${LANG_CODE_TO_LOCALE_NAME[langCode]})`
}

const langSelectorTriggerClasses = 'cursor-pointer bg-input/50 hover:bg-input border-input !h-14 w-30 rounded-lg border shadow-xs pr-2 gap-1'

const langSelectorContentClasses = 'flex flex-col items-start text-base font-medium min-w-0 flex-1'

export default function LanguageOptionsSelector() {
  const [language, setLanguage] = useAtom(configFields.language)

  const handleSourceLangChange = (newLangCode: LangCodeISO6393) => {
    setLanguage({ sourceCode: newLangCode })
  }

  const handleTargetLangChange = (newLangCode: LangCodeISO6393) => {
    setLanguage({ targetCode: newLangCode })
  }

  const sourceLangLabel = language.sourceCode === 'auto'
    ? `${langCodeLabel(language.detectedCode)} (auto)`
    : langCodeLabel(language.sourceCode)

  const targetLangLabel = langCodeLabel(language.targetCode)

  return (
    <div className="flex items-center justify-between">
      <Select value={language.sourceCode} onValueChange={handleSourceLangChange}>
        <SelectTrigger hideChevron className={langSelectorTriggerClasses}>
          <div className={langSelectorContentClasses}>
            <SelectValue asChild>
              <span className="truncate w-full">{sourceLangLabel}</span>
            </SelectValue>
            <span className="text-sm text-neutral-500">
              {language.sourceCode === 'auto'
                ? i18n.t('popup.autoLang')
                : i18n.t('popup.sourceLang')}
            </span>
          </div>
          <LangCodeSelectorChevronDownIcon />
        </SelectTrigger>
        <SelectContent className="rounded-lg shadow-md w-72">
          <SelectItem value="auto">
            {langCodeLabel(language.detectedCode)}
            <AutoLangCell />
          </SelectItem>
          {langCodeISO6393Schema.options.map(key => (
            <SelectItem key={key} value={key}>
              {langCodeLabel(key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Icon icon="tabler:arrow-right" className="h-4 w-4 text-neutral-500" />
      <Select value={language.targetCode} onValueChange={handleTargetLangChange}>
        <SelectTrigger hideChevron className={langSelectorTriggerClasses}>
          <div className={langSelectorContentClasses}>
            <SelectValue asChild>
              <span className="truncate w-full">{targetLangLabel}</span>
            </SelectValue>
            <span className="text-sm text-neutral-500">
              {i18n.t('popup.targetLang')}
            </span>
          </div>
          <LangCodeSelectorChevronDownIcon />
        </SelectTrigger>
        <SelectContent className="rounded-lg shadow-md w-72">
          {langCodeISO6393Schema.options.map(key => (
            <SelectItem key={key} value={key}>
              {langCodeLabel(key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function AutoLangCell() {
  return (
    <span className="rounded-full bg-neutral-200 px-1 text-xs dark:bg-neutral-800">
      auto
    </span>
  )
}

function LangCodeSelectorChevronDownIcon() {
  return (
    <Icon
      icon="tabler:chevron-down"
      className="flex-shrink-0 h-5 w-5 text-neutral-400 dark:text-neutral-600"
      strokeWidth={1.5}
    />
  )
}
