import type { JSONValue } from 'ai'
import type { Config } from '@/types/config/config'
import type { LLMTranslateProviderNames } from '@/types/config/provider'
import { storage } from '#imports'
import { generateText } from 'ai'
import { THINKING_MODELS } from '@/types/config/provider'
import { CONFIG_STORAGE_KEY, DEFAULT_PROVIDER_CONFIG } from '@/utils/constants/config'
import { sendMessage } from '@/utils/message'
import { getTranslateModel } from '@/utils/provider'

/**
 * Default budget for "thinking" mode models.
 * Consider making this configurable via environment or user settings if needed.
 */
const DEFAULT_THINKING_BUDGET = 128

export async function aiTranslate(provider: LLMTranslateProviderNames, modelString: string, prompt: string) {
  const model = await getTranslateModel(provider, modelString)

  const providerOptions: Record<string, Record<string, JSONValue>> = {
    google: {
      thinkingConfig: {
        thinkingBudget: THINKING_MODELS.includes(modelString as (typeof THINKING_MODELS)[number]) ? DEFAULT_THINKING_BUDGET : 0,
      },
    },
  }

  const { text } = await generateText({
    model,
    prompt,
    providerOptions,
  })
  return text
}

export async function googleTranslate(
  sourceText: string,
  fromLang: string,
  toLang: string,
): Promise<string> {
  const params = {
    client: 'gtx',
    sl: fromLang,
    tl: toLang,
    dt: 't',
    strip: 1,
    nonced: 1,
    q: encodeURIComponent(sourceText),
  }

  const queryString = Object.keys(params)
    .map(key => `${key}=${params[key as keyof typeof params]}`)
    .join('&')

  const resp = await fetch(
    `https://translate.googleapis.com/translate_a/single?${queryString}`,
    {
      method: 'GET',
    },
  ).catch((error) => {
    throw new Error(`Network error during translation: ${error.message}`)
  })

  if (!resp.ok) {
    const errorText = await resp
      .text()
      .catch(() => 'Unable to read error response')
    throw new Error(
      `Translation request failed: ${resp.status} ${resp.statusText}${
        errorText ? ` - ${errorText}` : ''
      }`,
    )
  }

  try {
    const result = await resp.json()

    // Google Translate API returns nested arrays where result[0] contains
    // arrays of translation chunks, and the first element of each chunk
    // is the translated text
    if (!Array.isArray(result) || !Array.isArray(result[0])) {
      throw new TypeError('Unexpected response format from translation API')
    }

    // Combine all translation chunks
    const translatedText = result[0]
      .filter(Array.isArray)
      .map(chunk => chunk[0])
      .filter(Boolean)
      .join('')

    return translatedText
  }
  catch (error) {
    throw new Error(
      `Failed to parse translation response: ${(error as Error).message}`,
    )
  }
}

export async function deeplxTranslate(
  sourceText: string,
  fromLang: string,
  toLang: string,
  options?: { backgroundFetch?: boolean },
): Promise<string> {
  const config = await storage.getItem<Config>(`local:${CONFIG_STORAGE_KEY}`)
  const baseURL = config?.providersConfig?.deeplx?.baseURL ?? DEFAULT_PROVIDER_CONFIG.deeplx.baseURL
  const apiKey = config?.providersConfig?.deeplx?.apiKey

  if (!baseURL) {
    throw new Error('DeepLX baseURL is not configured')
  }

  const formatLang = (lang: string) => (lang === 'auto' ? 'auto' : lang.toUpperCase())
  const url = `${baseURL.replace(/\/$/, '')}${apiKey ? `/${apiKey}` : ''}/translate`

  const requestBody = JSON.stringify({
    text: sourceText,
    source_lang: formatLang(fromLang),
    target_lang: formatLang(toLang),
  })

  // Choose fetch implementation based on options
  const fetchResponse = options?.backgroundFetch
    ? await fetchViaBackground(url, requestBody)
    : await fetchDirect(url, requestBody)

  return parseDeepLXResponse(fetchResponse)
}

async function fetchViaBackground(url: string, body: string) {
  const resp = await sendMessage('backgroundFetch', {
    url,
    method: 'POST',
    headers: [['Content-Type', 'application/json']],
    body,
    credentials: 'omit',
  })

  return {
    ok: resp.status >= 200 && resp.status < 300,
    status: resp.status,
    statusText: resp.statusText,
    text: () => Promise.resolve(resp.body),
    json: () => Promise.resolve(JSON.parse(resp.body)),
  }
}

async function fetchDirect(url: string, body: string) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }).catch((error) => {
    throw new Error(`Network error during DeepLX translation: ${error.message}`)
  })

  return resp
}

async function parseDeepLXResponse(resp: { ok: boolean, status: number, statusText: string, json: () => Promise<any> }) {
  if (!resp.ok) {
    throw new Error(
      `DeepLX translation request failed: ${resp.status} ${resp.statusText}`,
    )
  }

  try {
    const result = await resp.json()
    if (typeof result?.data !== 'string') {
      throw new TypeError('Unexpected response format from DeepLX translation API')
    }
    return result.data
  }
  catch (error) {
    throw new Error(
      `Failed to parse DeepLX translation response: ${(error as Error).message}`,
    )
  }
}

export async function microsoftTranslate(
  sourceText: string,
  fromLang: string,
  toLang: string,
): Promise<string> {
  // If fromLang is 'auto', use empty string as Microsoft's API expects
  const effectiveFromLang = fromLang === 'auto' ? '' : fromLang

  // Get a valid token
  const token = await refreshMicrosoftToken()

  const resp = await fetch(
    `https://api-edge.cognitive.microsofttranslator.com/translate?from=${effectiveFromLang}&to=${toLang}&api-version=3.0&includeSentenceLength=true&textType=html`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': token,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify([{ Text: sourceText }]),
    },
  ).catch((error) => {
    throw new Error(
      `Network error during Microsoft translation: ${error.message}`,
    )
  })

  if (!resp.ok) {
    const errorText = await resp
      .text()
      .catch(() => 'Unable to read error response')
    throw new Error(
      `Microsoft translation request failed: ${resp.status} ${resp.statusText}${
        errorText ? ` - ${errorText}` : ''
      }`,
    )
  }

  try {
    const result = await resp.json()

    if (!Array.isArray(result) || !result[0]?.translations?.[0]?.text) {
      throw new Error(
        'Unexpected response format from Microsoft translation API',
      )
    }

    return result[0].translations[0].text
  }
  catch (error) {
    throw new Error(
      `Failed to parse Microsoft translation response: ${(error as Error).message}`,
    )
  }
}

async function refreshMicrosoftToken(): Promise<string> {
  try {
    const resp = await fetch('https://edge.microsoft.com/translate/auth')

    if (!resp.ok) {
      throw new Error(
        `Failed to refresh Microsoft token: ${resp.status} ${resp.statusText}`,
      )
    }

    return await resp.text()
  }
  catch (error) {
    throw new Error(
      `Error refreshing Microsoft token: ${(error as Error).message}`,
    )
  }
}
