import { describe, expect, it } from 'vitest'
import { configExample, description } from './example/v010'
import type { Config } from '@/types/config/config'

/**
 * Test suite for v010 configuration example
 * Testing framework: Vitest
 * 
 * This test suite validates the v010 configuration example which represents
 * a configuration state after deprecating OpenRouter and Ollama providers.
 */
describe('v010 Configuration Example', () => {
  describe('Configuration Structure', () => {
    it('should have valid description', () => {
      expect(description).toBe('Deprecate OpenRouter and Ollama')
      expect(typeof description).toBe('string')
      expect(description.length).toBeGreaterThan(0)
    })

    it('should export a valid config object', () => {
      expect(configExample).toBeDefined()
      expect(typeof configExample).toBe('object')
      expect(configExample).not.toBeNull()
    })

    it('should conform to Config type structure', () => {
      expect(configExample).toHaveProperty('language')
      expect(configExample).toHaveProperty('providersConfig')
      expect(configExample).toHaveProperty('read')
      expect(configExample).toHaveProperty('translate')
      expect(configExample).toHaveProperty('floatingButton')
      expect(configExample).toHaveProperty('sideContent')
    })
  })

  describe('Language Configuration', () => {
    it('should have valid language settings', () => {
      const { language } = configExample
      
      expect(language.detectedCode).toBe('eng')
      expect(language.sourceCode).toBe('auto')
      expect(language.targetCode).toBe('jpn')
      expect(language.level).toBe('intermediate')
    })

    it('should have string values for all language properties', () => {
      const { language } = configExample
      
      expect(typeof language.detectedCode).toBe('string')
      expect(typeof language.sourceCode).toBe('string')
      expect(typeof language.targetCode).toBe('string')
      expect(typeof language.level).toBe('string')
    })

    it('should have valid language codes', () => {
      const { language } = configExample
      
      expect(language.detectedCode).toMatch(/^[a-z]{3}$/)
      expect(language.targetCode).toMatch(/^[a-z]{3}$/)
      expect(['auto', 'eng', 'jpn', 'spa', 'fra', 'deu']).toContain(language.sourceCode)
    })

    it('should have valid proficiency level', () => {
      const validLevels = ['beginner', 'intermediate', 'advanced']
      expect(validLevels).toContain(configExample.language.level)
    })
  })

  describe('Providers Configuration', () => {
    it('should only contain openai and deepseek providers (no deprecated providers)', () => {
      const { providersConfig } = configExample
      const providers = Object.keys(providersConfig)
      
      expect(providers).toEqual(['openai', 'deepseek'])
      expect(providers).not.toContain('openrouter')
      expect(providers).not.toContain('ollama')
    })

    it('should have valid OpenAI configuration', () => {
      const { openai } = configExample.providersConfig
      
      expect(openai).toBeDefined()
      expect(openai.apiKey).toBe('sk-1234567890')
      expect(openai.baseURL).toBe('https://api.openai.com/v1')
      expect(typeof openai.apiKey).toBe('string')
      expect(typeof openai.baseURL).toBe('string')
    })

    it('should have valid DeepSeek configuration', () => {
      const { deepseek } = configExample.providersConfig
      
      expect(deepseek).toBeDefined()
      expect(deepseek.apiKey).toBeUndefined()
      expect(deepseek.baseURL).toBe('https://api.deepseek.com/v1')
      expect(typeof deepseek.baseURL).toBe('string')
    })

    it('should have valid URL formats for baseURLs', () => {
      const { openai, deepseek } = configExample.providersConfig
      
      expect(openai.baseURL).toMatch(/^https:\/\//)
      expect(deepseek.baseURL).toMatch(/^https:\/\//)
      
      // Test URL validity
      expect(() => new URL(openai.baseURL)).not.toThrow()
      expect(() => new URL(deepseek.baseURL)).not.toThrow()
    })

    it('should have API key format validation for OpenAI', () => {
      const { openai } = configExample.providersConfig
      
      expect(openai.apiKey).toMatch(/^sk-/)
      expect(openai.apiKey.length).toBeGreaterThan(10)
    })
  })

  describe('Read Configuration', () => {
    it('should have valid read provider and models', () => {
      const { read } = configExample
      
      expect(read.provider).toBe('openai')
      expect(read.models).toBeDefined()
      expect(typeof read.models).toBe('object')
    })

    it('should have valid OpenAI read model configuration', () => {
      const { openai } = configExample.read.models
      
      expect(openai.model).toBe('gpt-4o-mini')
      expect(openai.isCustomModel).toBe(true)
      expect(openai.customModel).toBe('gpt-4.1-nano')
      expect(typeof openai.model).toBe('string')
      expect(typeof openai.isCustomModel).toBe('boolean')
      expect(typeof openai.customModel).toBe('string')
    })

    it('should have valid DeepSeek read model configuration', () => {
      const { deepseek } = configExample.read.models
      
      expect(deepseek.model).toBe('deepseek-chat')
      expect(deepseek.isCustomModel).toBe(false)
      expect(deepseek.customModel).toBe('')
      expect(typeof deepseek.model).toBe('string')
      expect(typeof deepseek.isCustomModel).toBe('boolean')
      expect(typeof deepseek.customModel).toBe('string')
    })

    it('should have consistent custom model configuration', () => {
      const { openai, deepseek } = configExample.read.models
      
      // When isCustomModel is true, customModel should not be empty
      if (openai.isCustomModel) {
        expect(openai.customModel).not.toBe('')
      }
      
      // When isCustomModel is false, customModel should be empty
      if (!deepseek.isCustomModel) {
        expect(deepseek.customModel).toBe('')
      }
    })
  })

  describe('Translate Configuration', () => {
    it('should have valid translate provider and models', () => {
      const { translate } = configExample
      
      expect(translate.provider).toBe('microsoft')
      expect(translate.models).toBeDefined()
      expect(typeof translate.models).toBe('object')
    })

    it('should have null values for Microsoft and Google models', () => {
      const { microsoft, google } = configExample.translate.models
      
      expect(microsoft).toBeNull()
      expect(google).toBeNull()
    })

    it('should have valid OpenAI translate model configuration', () => {
      const { openai } = configExample.translate.models
      
      expect(openai).toBeDefined()
      expect(openai.model).toBe('gpt-4o-mini')
      expect(openai.isCustomModel).toBe(true)
      expect(openai.customModel).toBe('gpt-4.1-nano')
    })

    it('should have valid DeepSeek translate model configuration', () => {
      const { deepseek } = configExample.translate.models
      
      expect(deepseek).toBeDefined()
      expect(deepseek.model).toBe('deepseek-chat')
      expect(deepseek.isCustomModel).toBe(false)
      expect(deepseek.customModel).toBe('')
    })

    it('should have valid node configuration', () => {
      const { node } = configExample.translate
      
      expect(node.enabled).toBe(true)
      expect(node.hotkey).toBe('Control')
      expect(typeof node.enabled).toBe('boolean')
      expect(typeof node.hotkey).toBe('string')
    })

    it('should have valid page configuration', () => {
      const { page } = configExample.translate
      
      expect(page.range).toBe('main')
      expect(Array.isArray(page.autoTranslatePatterns)).toBe(true)
      expect(page.autoTranslatePatterns).toContain('news.ycombinator.com')
    })

    it('should have valid auto-translate patterns', () => {
      const { autoTranslatePatterns } = configExample.translate.page
      
      autoTranslatePatterns.forEach(pattern => {
        expect(typeof pattern).toBe('string')
        expect(pattern.length).toBeGreaterThan(0)
        // Should be valid domain format
        expect(pattern).toMatch(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      })
    })
  })

  describe('Prompts Configuration', () => {
    it('should have valid prompts configuration structure', () => {
      const { promptsConfig } = configExample.translate
      
      expect(promptsConfig.prompt).toBe('Read Frog: TRANSLATE_DEFAULT_PROMPT')
      expect(Array.isArray(promptsConfig.patterns)).toBe(true)
      expect(promptsConfig.patterns.length).toBe(1)
    })

    it('should have valid prompt pattern', () => {
      const [pattern] = configExample.translate.promptsConfig.patterns
      
      expect(pattern.id).toBe('Read Frog: TRANSLATE_DEFAULT_PROMPT')
      expect(pattern.name).toBe('Read Frog: TRANSLATE_DEFAULT_PROMPT')
      expect(pattern.prompt).toBeDefined()
      expect(typeof pattern.prompt).toBe('string')
      expect(pattern.prompt.length).toBeGreaterThan(0)
    })

    it('should have prompt with required placeholders', () => {
      const [pattern] = configExample.translate.promptsConfig.patterns
      
      expect(pattern.prompt).toContain('{{targetLang}}')
      expect(pattern.prompt).toContain('{{input}}')
    })

    it('should have consistent prompt references', () => {
      const { promptsConfig } = configExample.translate
      const [pattern] = promptsConfig.patterns
      
      expect(promptsConfig.prompt).toBe(pattern.id)
      expect(pattern.id).toBe(pattern.name)
    })
  })

  describe('Request Queue Configuration', () => {
    it('should have valid request queue settings', () => {
      const { requestQueueConfig } = configExample.translate
      
      expect(requestQueueConfig.capacity).toBe(300)
      expect(requestQueueConfig.rate).toBe(5)
      expect(typeof requestQueueConfig.capacity).toBe('number')
      expect(typeof requestQueueConfig.rate).toBe('number')
    })

    it('should have positive numeric values for queue settings', () => {
      const { requestQueueConfig } = configExample.translate
      
      expect(requestQueueConfig.capacity).toBeGreaterThan(0)
      expect(requestQueueConfig.rate).toBeGreaterThan(0)
    })

    it('should have reasonable queue limits', () => {
      const { requestQueueConfig } = configExample.translate
      
      expect(requestQueueConfig.capacity).toBeLessThanOrEqual(1000)
      expect(requestQueueConfig.rate).toBeLessThanOrEqual(100)
    })
  })

  describe('UI Configuration', () => {
    it('should have valid floating button configuration', () => {
      const { floatingButton } = configExample
      
      expect(floatingButton.enabled).toBe(true)
      expect(floatingButton.position).toBe(0.66)
      expect(typeof floatingButton.enabled).toBe('boolean')
      expect(typeof floatingButton.position).toBe('number')
    })

    it('should have valid position value', () => {
      const { floatingButton } = configExample
      
      expect(floatingButton.position).toBeGreaterThanOrEqual(0)
      expect(floatingButton.position).toBeLessThanOrEqual(1)
    })

    it('should have valid side content configuration', () => {
      const { sideContent } = configExample
      
      expect(sideContent.width).toBe(400)
      expect(typeof sideContent.width).toBe('number')
      expect(sideContent.width).toBeGreaterThan(0)
    })

    it('should have reasonable width values', () => {
      const { sideContent } = configExample
      
      expect(sideContent.width).toBeGreaterThanOrEqual(200)
      expect(sideContent.width).toBeLessThanOrEqual(800)
    })
  })

  describe('Configuration Consistency', () => {
    it('should have consistent provider references', () => {
      const availableProviders = Object.keys(configExample.providersConfig)
      
      expect(availableProviders).toContain(configExample.read.provider)
      // translate.provider is 'microsoft' which doesn't need to be in providersConfig
    })

    it('should have consistent model configurations across read and translate', () => {
      const readOpenAI = configExample.read.models.openai
      const translateOpenAI = configExample.translate.models.openai
      
      expect(readOpenAI.model).toBe(translateOpenAI.model)
      expect(readOpenAI.isCustomModel).toBe(translateOpenAI.isCustomModel)
      expect(readOpenAI.customModel).toBe(translateOpenAI.customModel)
    })

    it('should not contain deprecated provider configurations', () => {
      const config = JSON.stringify(configExample)
      
      expect(config).not.toContain('openrouter')
      expect(config).not.toContain('ollama')
    })

    it('should be serializable to JSON', () => {
      expect(() => JSON.stringify(configExample)).not.toThrow()
      expect(() => JSON.parse(JSON.stringify(configExample))).not.toThrow()
    })

    it('should maintain object structure after serialization', () => {
      const serialized = JSON.stringify(configExample)
      const deserialized = JSON.parse(serialized)
      
      expect(deserialized).toEqual(configExample)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined/null values appropriately', () => {
      expect(configExample.providersConfig.deepseek.apiKey).toBeUndefined()
      expect(configExample.translate.models.microsoft).toBeNull()
      expect(configExample.translate.models.google).toBeNull()
    })

    it('should have no circular references', () => {
      expect(() => JSON.stringify(configExample)).not.toThrow()
    })

    it('should have immutable structure properties', () => {
      // Test that the config object structure is well-defined
      expect(configExample.language).toBeDefined()
      expect(configExample.providersConfig).toBeDefined()
      expect(configExample.read).toBeDefined()
      expect(configExample.translate).toBeDefined()
      expect(configExample.floatingButton).toBeDefined()
      expect(configExample.sideContent).toBeDefined()
    })
  })

  describe('Migration Validation', () => {
    it('should represent post-migration state correctly', () => {
      expect(description).toContain('Deprecate')
      expect(description).toContain('OpenRouter')
      expect(description).toContain('Ollama')
    })

    it('should maintain essential functionality after migration', () => {
      // Should still have working provider configurations
      expect(Object.keys(configExample.providersConfig).length).toBeGreaterThan(0)
      
      // Should still have working model configurations
      expect(Object.keys(configExample.read.models).length).toBeGreaterThan(0)
      expect(Object.keys(configExample.translate.models).length).toBeGreaterThan(0)
    })

    it('should have valid fallback configurations', () => {
      // Microsoft and Google are fallback providers
      expect(configExample.translate.provider).toBe('microsoft')
      
      // Should have OpenAI as backup for complex tasks
      expect(configExample.translate.models.openai).toBeDefined()
      expect(configExample.read.provider).toBe('openai')
    })

    it('should have proper provider consolidation', () => {
      // After deprecation, should only have 2 AI providers in providersConfig
      expect(Object.keys(configExample.providersConfig)).toHaveLength(2)
      
      // Should maintain both read and translate capabilities
      expect(configExample.read.models.openai).toBeDefined()
      expect(configExample.read.models.deepseek).toBeDefined()
      expect(configExample.translate.models.openai).toBeDefined()
      expect(configExample.translate.models.deepseek).toBeDefined()
    })
  })

  describe('Type Safety and Validation', () => {
    it('should satisfy Config type requirements', () => {
      // This test ensures the config conforms to the expected type structure
      const config: Config = configExample
      expect(config).toBeDefined()
    })

    it('should have proper nested object structures', () => {
      expect(configExample.language).toBeTypeOf('object')
      expect(configExample.providersConfig).toBeTypeOf('object')
      expect(configExample.read).toBeTypeOf('object')
      expect(configExample.translate).toBeTypeOf('object')
      expect(configExample.floatingButton).toBeTypeOf('object')
      expect(configExample.sideContent).toBeTypeOf('object')
    })

    it('should have all required nested properties', () => {
      // Language properties
      expect(configExample.language).toHaveProperty('detectedCode')
      expect(configExample.language).toHaveProperty('sourceCode')
      expect(configExample.language).toHaveProperty('targetCode')
      expect(configExample.language).toHaveProperty('level')
      
      // Provider configuration properties
      expect(configExample.providersConfig).toHaveProperty('openai')
      expect(configExample.providersConfig).toHaveProperty('deepseek')
      
      // Read configuration properties
      expect(configExample.read).toHaveProperty('provider')
      expect(configExample.read).toHaveProperty('models')
      
      // Translate configuration properties
      expect(configExample.translate).toHaveProperty('provider')
      expect(configExample.translate).toHaveProperty('models')
      expect(configExample.translate).toHaveProperty('node')
      expect(configExample.translate).toHaveProperty('page')
      expect(configExample.translate).toHaveProperty('promptsConfig')
      expect(configExample.translate).toHaveProperty('requestQueueConfig')
    })

    it('should have valid hotkey configuration', () => {
      const validHotkeys = ['Control', 'Alt', 'Shift', 'Meta', 'Ctrl+Shift', 'Alt+Shift']
      expect(validHotkeys).toContain(configExample.translate.node.hotkey)
    })

    it('should have valid page range configuration', () => {
      const validRanges = ['main', 'all', 'selection', 'article']
      expect(validRanges).toContain(configExample.translate.page.range)
    })
  })
})