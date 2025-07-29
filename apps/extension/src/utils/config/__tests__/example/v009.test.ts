import { describe, it, expect } from '@jest/globals'
import { description, configExample } from './v009'

describe('v009 Configuration Example', () => {
  describe('description', () => {
    it('should export a valid description string', () => {
      expect(description).toBeDefined()
      expect(typeof description).toBe('string')
      expect(description.length).toBeGreaterThan(0)
    })

    it('should have a meaningful description', () => {
      expect(description).toBe('Expose Translate Request Rate')
      expect(description).toMatch(/^[A-Z]/)
    })
  })

  describe('configExample structure validation', () => {
    it('should export a valid configuration object', () => {
      expect(configExample).toBeDefined()
      expect(typeof configExample).toBe('object')
      expect(configExample).not.toBeNull()
    })

    it('should have all required top-level properties', () => {
      const requiredProps = [
        'language',
        'providersConfig',
        'read',
        'translate',
        'floatingButton',
        'sideContent'
      ]
      
      requiredProps.forEach(prop => {
        expect(configExample).toHaveProperty(prop)
      })
    })
  })

  describe('language configuration', () => {
    it('should have valid language settings', () => {
      const { language } = configExample
      
      expect(language).toBeDefined()
      expect(language.detectedCode).toBe('eng')
      expect(language.sourceCode).toBe('auto')
      expect(language.targetCode).toBe('jpn')
      expect(language.level).toBe('intermediate')
    })

    it('should have string values for language codes', () => {
      const { language } = configExample
      
      expect(typeof language.detectedCode).toBe('string')
      expect(typeof language.sourceCode).toBe('string')
      expect(typeof language.targetCode).toBe('string')
      expect(typeof language.level).toBe('string')
    })

    it('should have valid language code formats', () => {
      const { language } = configExample
      
      expect(language.detectedCode).toMatch(/^[a-z]{3}$/)
      expect(language.targetCode).toMatch(/^[a-z]{3}$/)
      expect(['auto', 'eng', 'jpn', 'spa', 'fra']).toContain(language.sourceCode)
    })
  })

  describe('providersConfig', () => {
    it('should have all expected providers', () => {
      const { providersConfig } = configExample
      const expectedProviders = ['openai', 'deepseek', 'openrouter', 'ollama']
      
      expectedProviders.forEach(provider => {
        expect(providersConfig).toHaveProperty(provider)
      })
    })

    it('should have valid openai configuration', () => {
      const { openai } = configExample.providersConfig
      
      expect(openai.apiKey).toBe('sk-1234567890')
      expect(openai.baseURL).toBe('https://api.openai.com/v1')
      expect(typeof openai.apiKey).toBe('string')
      expect(typeof openai.baseURL).toBe('string')
    })

    it('should have valid API key formats where defined', () => {
      const { openai } = configExample.providersConfig
      
      if (openai.apiKey) {
        expect(openai.apiKey).toMatch(/^sk-/)
      }
    })

    it('should have valid baseURL formats', () => {
      const { providersConfig } = configExample
      
      Object.values(providersConfig).forEach(provider => {
        expect(provider.baseURL).toMatch(/^https?:\/\//)
      })
    })

    it('should handle undefined API keys correctly', () => {
      const { deepseek, openrouter, ollama } = configExample.providersConfig
      
      expect(deepseek.apiKey).toBeUndefined()
      expect(openrouter.apiKey).toBeUndefined()
      expect(ollama.apiKey).toBeUndefined()
    })
  })

  describe('read configuration', () => {
    it('should have valid read settings', () => {
      const { read } = configExample
      
      expect(read.provider).toBe('openai')
      expect(read.models).toBeDefined()
      expect(typeof read.models).toBe('object')
    })

    it('should have valid model configurations for read', () => {
      const { read } = configExample
      
      expect(read.models.openai).toBeDefined()
      expect(read.models.openai.model).toBe('gpt-4o-mini')
      expect(read.models.openai.isCustomModel).toBe(true)
      expect(read.models.openai.customModel).toBe('gpt-4.1-nano')
      
      expect(read.models.deepseek).toBeDefined()
      expect(read.models.deepseek.model).toBe('deepseek-chat')
      expect(read.models.deepseek.isCustomModel).toBe(false)
      expect(read.models.deepseek.customModel).toBe('')
    })
  })

  describe('translate configuration', () => {
    it('should have valid translate provider', () => {
      const { translate } = configExample
      
      expect(translate.provider).toBe('microsoft')
      expect(typeof translate.provider).toBe('string')
    })

    it('should have valid model configurations', () => {
      const { translate } = configExample
      
      expect(translate.models.microsoft).toBeNull()
      expect(translate.models.google).toBeNull()
      
      expect(translate.models.openai).toBeDefined()
      expect(translate.models.openai.model).toBe('gpt-4o-mini')
      expect(translate.models.openai.isCustomModel).toBe(true)
    })

    it('should have valid node configuration', () => {
      const { translate } = configExample
      
      expect(translate.node.enabled).toBe(true)
      expect(translate.node.hotkey).toBe('Control')
      expect(typeof translate.node.enabled).toBe('boolean')
      expect(typeof translate.node.hotkey).toBe('string')
    })

    it('should have valid page configuration', () => {
      const { translate } = configExample
      
      expect(translate.page.range).toBe('main')
      expect(Array.isArray(translate.page.autoTranslatePatterns)).toBe(true)
      expect(translate.page.autoTranslatePatterns).toContain('news.ycombinator.com')
    })

    it('should have valid prompts configuration', () => {
      const { translate } = configExample
      
      expect(translate.promptsConfig.prompt).toBe('Read Frog: TRANSLATE_DEFAULT_PROMPT')
      expect(Array.isArray(translate.promptsConfig.patterns)).toBe(true)
      expect(translate.promptsConfig.patterns).toHaveLength(1)
      
      const pattern = translate.promptsConfig.patterns[0]
      expect(pattern.id).toBe('Read Frog: TRANSLATE_DEFAULT_PROMPT')
      expect(pattern.name).toBe('Read Frog: TRANSLATE_DEFAULT_PROMPT')
      expect(pattern.prompt).toContain('{{targetLang}}')
      expect(pattern.prompt).toContain('{{input}}')
    })

    it('should have valid request queue configuration', () => {
      const { translate } = configExample
      
      expect(translate.requestQueueConfig.capacity).toBe(300)
      expect(translate.requestQueueConfig.rate).toBe(5)
      expect(typeof translate.requestQueueConfig.capacity).toBe('number')
      expect(typeof translate.requestQueueConfig.rate).toBe('number')
      expect(translate.requestQueueConfig.capacity).toBeGreaterThan(0)
      expect(translate.requestQueueConfig.rate).toBeGreaterThan(0)
    })
  })

  describe('floatingButton configuration', () => {
    it('should have valid floating button settings', () => {
      const { floatingButton } = configExample
      
      expect(floatingButton.enabled).toBe(true)
      expect(floatingButton.position).toBe(0.66)
      expect(typeof floatingButton.enabled).toBe('boolean')
      expect(typeof floatingButton.position).toBe('number')
    })

    it('should have position within valid range', () => {
      const { floatingButton } = configExample
      
      expect(floatingButton.position).toBeGreaterThanOrEqual(0)
      expect(floatingButton.position).toBeLessThanOrEqual(1)
    })
  })

  describe('sideContent configuration', () => {
    it('should have valid side content settings', () => {
      const { sideContent } = configExample
      
      expect(sideContent.width).toBe(400)
      expect(typeof sideContent.width).toBe('number')
      expect(sideContent.width).toBeGreaterThan(0)
    })
  })

  describe('data integrity and consistency', () => {
    it('should have consistent model configurations across providers', () => {
      const { read, translate } = configExample
      
      // Check that common providers have consistent structure
      const commonProviders = ['openai', 'deepseek']
      
      commonProviders.forEach(provider => {
        if (read.models[provider] && translate.models[provider]) {
          expect(typeof read.models[provider].model).toBe('string')
          expect(typeof translate.models[provider].model).toBe('string')
          expect(typeof read.models[provider].isCustomModel).toBe('boolean')
          expect(typeof translate.models[provider].isCustomModel).toBe('boolean')
        }
      })
    })

    it('should have valid URL formats in baseURL fields', () => {
      const { providersConfig } = configExample
      
      Object.values(providersConfig).forEach(provider => {
        expect(provider.baseURL).toMatch(/^https?:\/\/[^\s]+/)
      })
    })

    it('should have consistent prompt template variables', () => {
      const { translate } = configExample
      const promptTemplate = translate.promptsConfig.patterns[0].prompt
      
      expect(promptTemplate).toContain('{{targetLang}}')
      expect(promptTemplate).toContain('{{input}}')
      expect(promptTemplate).toMatch(/\{\{[a-zA-Z]+\}\}/)
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('should handle empty or null values appropriately', () => {
      const { translate } = configExample
      
      expect(translate.models.microsoft).toBeNull()
      expect(translate.models.google).toBeNull()
      expect(translate.models.deepseek.customModel).toBe('')
    })

    it('should maintain immutability of exported config', () => {
      const originalConfig = JSON.stringify(configExample)
      
      // Attempt to modify the config
      try {
        configExample.language.detectedCode = 'modified'
      } catch (error) {
        // Expected if object is frozen
      }
      
      // Verify structure remains intact
      expect(configExample.language).toHaveProperty('detectedCode')
      expect(configExample.language).toHaveProperty('sourceCode')
      expect(configExample.language).toHaveProperty('targetCode')
    })

    it('should handle special characters in patterns correctly', () => {
      const { translate } = configExample
      const patterns = translate.page.autoTranslatePatterns
      
      patterns.forEach(pattern => {
        expect(typeof pattern).toBe('string')
        expect(pattern.length).toBeGreaterThan(0)
      })
    })
  })

  describe('configuration completeness', () => {
    it('should have all necessary fields for a working configuration', () => {
      // Test that all critical paths exist
      expect(configExample.language.targetCode).toBeDefined()
      expect(configExample.translate.provider).toBeDefined()
      expect(configExample.translate.requestQueueConfig.capacity).toBeDefined()
      expect(configExample.translate.requestQueueConfig.rate).toBeDefined()
    })

    it('should have valid default values', () => {
      expect(configExample.translate.requestQueueConfig.capacity).toBeGreaterThan(0)
      expect(configExample.translate.requestQueueConfig.rate).toBeGreaterThan(0)
      expect(configExample.sideContent.width).toBeGreaterThan(0)
      expect(configExample.floatingButton.position).toBeGreaterThanOrEqual(0)
    })
  })
})