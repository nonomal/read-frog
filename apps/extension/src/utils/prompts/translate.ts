import { globalConfig } from '@/utils/config/config'
import { DEFAULT_TRANSLATE_PROMPT, INPUT_TOKEN, TARGET_LANG_TOKEN } from '../constants/prompt'

/**
 * Generates a translation prompt by inserting the target language and input text into a template.
 *
 * Selects a prompt template based on the current global configuration. If no matching template is found, a default prompt is used. The function replaces placeholder tokens in the template with the provided target language and input text.
 *
 * @param targetLang - The language to translate into
 * @param input - The text to be translated
 * @returns The formatted translation prompt string
 * @throws If the global configuration is not available
 */
export function getTranslatePrompt(targetLang: string, input: string) {
  if (!globalConfig) {
    throw new Error('No global config when translate text')
  }
  const promptsConfig = globalConfig.translate.promptsConfig
  const { patterns = [], prompt: promptId = '' } = promptsConfig

  const prompt = patterns.find(pattern => pattern.id === promptId)?.prompt ?? DEFAULT_TRANSLATE_PROMPT

  return prompt
    .replaceAll(TARGET_LANG_TOKEN, targetLang)
    .replaceAll(INPUT_TOKEN, input)
}
