import { describe, expect, it } from 'vitest'
import { migrate } from '../../migration-scripts/v009-to-v010'

describe('v009-to-v010 migration', () => {
  describe('migrate function', () => {
    it('should remove openrouter and ollama from providersConfig', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: { apiKey: 'test-key' },
          ollama: { baseUrl: 'http://localhost:11434' },
          openai: { apiKey: 'openai-key' }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).not.toHaveProperty('openrouter')
      expect(result.providersConfig).not.toHaveProperty('ollama')
      expect(result.providersConfig).toHaveProperty('openai')
      expect(result.providersConfig.openai).toEqual({ apiKey: 'openai-key' })
    })

    it('should remove openrouter and ollama from read.models', () => {
      const oldConfig = {
        read: {
          models: {
            openrouter: 'meta-llama/llama-2-7b-chat',
            ollama: 'llama2',
            openai: 'gpt-3.5-turbo'
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.read.models).not.toHaveProperty('openrouter')
      expect(result.read.models).not.toHaveProperty('ollama')
      expect(result.read.models).toHaveProperty('openai')
      expect(result.read.models.openai).toBe('gpt-3.5-turbo')
    })

    it('should remove openrouter and ollama from translate.models', () => {
      const oldConfig = {
        translate: {
          models: {
            openrouter: 'meta-llama/llama-2-7b-chat',
            ollama: 'llama2',
            deepseek: 'deepseek-chat'
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.translate.models).not.toHaveProperty('openrouter')
      expect(result.translate.models).not.toHaveProperty('ollama')
      expect(result.translate.models).toHaveProperty('deepseek')
      expect(result.translate.models.deepseek).toBe('deepseek-chat')
    })

    it('should handle config with all deprecated providers and models', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: { apiKey: 'or-key', baseURL: 'https://openrouter.ai/api/v1' },
          ollama: { baseURL: 'http://localhost:11434/v1' },
          openai: { apiKey: 'openai-key', baseURL: 'https://api.openai.com/v1' }
        },
        read: {
          provider: 'openrouter',
          models: {
            openrouter: { model: 'meta-llama/llama-2-7b-chat', isCustomModel: false },
            ollama: { model: 'llama2', isCustomModel: false },
            openai: { model: 'gpt-4', isCustomModel: true, customModel: 'gpt-4-turbo' }
          }
        },
        translate: {
          provider: 'ollama',
          models: {
            openrouter: { model: 'meta-llama/llama-2-13b-chat', isCustomModel: false },
            ollama: { model: 'gemma3:1b', isCustomModel: false },
            deepseek: { model: 'deepseek-chat', isCustomModel: false }
          }
        }
      }

      const result = migrate(oldConfig)

      // Check providersConfig - deprecated providers removed
      expect(result.providersConfig).not.toHaveProperty('openrouter')
      expect(result.providersConfig).not.toHaveProperty('ollama')
      expect(result.providersConfig.openai).toEqual({ 
        apiKey: 'openai-key', 
        baseURL: 'https://api.openai.com/v1' 
      })

      // Check read.models - deprecated models removed
      expect(result.read.models).not.toHaveProperty('openrouter')
      expect(result.read.models).not.toHaveProperty('ollama')
      expect(result.read.models.openai).toEqual({ 
        model: 'gpt-4', 
        isCustomModel: true, 
        customModel: 'gpt-4-turbo' 
      })

      // Check translate.models - deprecated models removed
      expect(result.translate.models).not.toHaveProperty('openrouter')
      expect(result.translate.models).not.toHaveProperty('ollama')
      expect(result.translate.models.deepseek).toEqual({ 
        model: 'deepseek-chat', 
        isCustomModel: false 
      })

      // Other properties should be preserved
      expect(result.read.provider).toBe('openrouter')
      expect(result.translate.provider).toBe('ollama')
    })

    it('should handle config without deprecated providers', () => {
      const oldConfig = {
        providersConfig: {
          openai: { apiKey: 'openai-key', baseURL: 'https://api.openai.com/v1' },
          deepseek: { apiKey: 'deepseek-key', baseURL: 'https://api.deepseek.com/v1' }
        },
        read: {
          models: {
            openai: { model: 'gpt-4o-mini', isCustomModel: false },
            deepseek: { model: 'deepseek-chat', isCustomModel: false }
          }
        },
        translate: {
          models: {
            microsoft: null,
            google: null,
            openai: { model: 'gpt-3.5-turbo', isCustomModel: false },
            deepseek: { model: 'deepseek-chat', isCustomModel: false }
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).toEqual(oldConfig.providersConfig)
      expect(result.read.models).toEqual(oldConfig.read.models)
      expect(result.translate.models).toEqual(oldConfig.translate.models)
    })

    it('should handle empty config object', () => {
      const oldConfig = {}

      const result = migrate(oldConfig)

      expect(result).toEqual({
        providersConfig: {},
        read: {
          models: {}
        },
        translate: {
          models: {}
        }
      })
    })

    it('should handle config with missing providersConfig', () => {
      const oldConfig = {
        read: {
          models: {
            openrouter: { model: 'meta-llama/llama-2-7b-chat' },
            openai: { model: 'gpt-4' }
          }
        },
        translate: {
          models: {
            ollama: { model: 'llama2' },
            deepseek: { model: 'deepseek-chat' }
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).toEqual({})
      expect(result.read.models).not.toHaveProperty('openrouter')
      expect(result.read.models.openai).toEqual({ model: 'gpt-4' })
      expect(result.translate.models).not.toHaveProperty('ollama')
      expect(result.translate.models.deepseek).toEqual({ model: 'deepseek-chat' })
    })

    it('should handle config with missing read section', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: { apiKey: 'test-key' },
          openai: { apiKey: 'openai-key' }
        },
        translate: {
          models: {
            ollama: { model: 'llama2' },
            deepseek: { model: 'deepseek-chat' }
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).not.toHaveProperty('openrouter')
      expect(result.providersConfig.openai).toEqual({ apiKey: 'openai-key' })
      expect(result.read.models).toEqual({})
      expect(result.translate.models).not.toHaveProperty('ollama')
      expect(result.translate.models.deepseek).toEqual({ model: 'deepseek-chat' })
    })

    it('should handle config with missing translate section', () => {
      const oldConfig = {
        providersConfig: {
          ollama: { baseURL: 'http://localhost:11434/v1' },
          deepseek: { apiKey: 'deepseek-key' }
        },
        read: {
          models: {
            openrouter: { model: 'meta-llama/llama-2-7b-chat' },
            openai: { model: 'gpt-4' }
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).not.toHaveProperty('ollama')
      expect(result.providersConfig.deepseek).toEqual({ apiKey: 'deepseek-key' })
      expect(result.read.models).not.toHaveProperty('openrouter')
      expect(result.read.models.openai).toEqual({ model: 'gpt-4' })
      expect(result.translate.models).toEqual({})
    })

    it('should handle config with missing models in read section', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: { apiKey: 'test-key' }
        },
        read: {
          provider: 'openai',
          someOtherProperty: 'value'
        },
        translate: {
          models: {
            ollama: { model: 'llama2' }
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).not.toHaveProperty('openrouter')
      expect(result.read.models).toEqual({})
      expect(result.read.provider).toBe('openai')
      expect(result.read.someOtherProperty).toBe('value')
      expect(result.translate.models).not.toHaveProperty('ollama')
    })

    it('should handle config with missing models in translate section', () => {
      const oldConfig = {
        providersConfig: {
          ollama: { baseURL: 'http://localhost:11434/v1' }
        },
        read: {
          models: {
            openrouter: { model: 'meta-llama/llama-2-7b-chat' }
          }
        },
        translate: {
          provider: 'microsoft',
          node: { enabled: true, hotkey: 'Control' },
          page: { range: 'main' }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).not.toHaveProperty('ollama')
      expect(result.read.models).not.toHaveProperty('openrouter')
      expect(result.translate.models).toEqual({})
      expect(result.translate.provider).toBe('microsoft')
      expect(result.translate.node).toEqual({ enabled: true, hotkey: 'Control' })
      expect(result.translate.page).toEqual({ range: 'main' })
    })

    it('should preserve other properties in the config', () => {
      const oldConfig = {
        language: {
          detectedCode: 'eng',
          sourceCode: 'auto',
          targetCode: 'jpn',
          level: 'intermediate'
        },
        providersConfig: {
          openrouter: { apiKey: 'test-key' },
          openai: { apiKey: 'openai-key', baseURL: 'https://api.openai.com/v1' }
        },
        read: {
          provider: 'openai',
          models: {
            ollama: { model: 'llama2' },
            openai: { model: 'gpt-4o-mini', isCustomModel: true, customModel: 'gpt-4.1-nano' }
          }
        },
        translate: {
          provider: 'microsoft',
          models: {
            openrouter: { model: 'meta-llama/llama-4-maverick:free' },
            microsoft: null,
            google: null,
            deepseek: { model: 'deepseek-chat' }
          },
          node: { enabled: true, hotkey: 'Control' },
          page: { range: 'main', autoTranslatePatterns: ['news.ycombinator.com'] },
          promptsConfig: {
            prompt: 'Read Frog: TRANSLATE_DEFAULT_PROMPT',
            patterns: []
          },
          requestQueueConfig: { capacity: 300, rate: 5 }
        },
        floatingButton: { enabled: true, position: 0.66 },
        sideContent: { width: 400 }
      }

      const result = migrate(oldConfig)

      // Language config should be preserved
      expect(result.language).toEqual(oldConfig.language)

      // Other top-level properties should be preserved
      expect(result.floatingButton).toEqual(oldConfig.floatingButton)
      expect(result.sideContent).toEqual(oldConfig.sideContent)

      // Read section properties should be preserved (except deprecated models)
      expect(result.read.provider).toBe('openai')

      // Translate section properties should be preserved (except deprecated models)
      expect(result.translate.provider).toBe('microsoft')
      expect(result.translate.node).toEqual({ enabled: true, hotkey: 'Control' })
      expect(result.translate.page).toEqual({ range: 'main', autoTranslatePatterns: ['news.ycombinator.com'] })
      expect(result.translate.promptsConfig).toEqual(oldConfig.translate.promptsConfig)
      expect(result.translate.requestQueueConfig).toEqual(oldConfig.translate.requestQueueConfig)
    })

    it('should handle null and undefined values gracefully', () => {
      const oldConfig = {
        providersConfig: null,
        read: undefined,
        translate: {
          models: null
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).toEqual({})
      expect(result.read.models).toEqual({})
      expect(result.translate.models).toEqual({})
    })

    it('should not mutate the original config object', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: { apiKey: 'test-key' },
          openai: { apiKey: 'openai-key' }
        },
        read: {
          models: {
            ollama: { model: 'llama2' },
            openai: { model: 'gpt-4' }
          }
        }
      }

      const originalConfig = JSON.parse(JSON.stringify(oldConfig))
      migrate(oldConfig)

      expect(oldConfig).toEqual(originalConfig)
    })

    it('should handle deeply nested structures in provider configs', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: {
            apiKey: 'test-key',
            baseURL: 'https://openrouter.ai/api/v1',
            settings: {
              timeout: 5000,
              retries: 3,
              headers: {
                'User-Agent': 'MyApp/1.0'
              }
            }
          },
          openai: { 
            apiKey: 'openai-key',
            baseURL: 'https://api.openai.com/v1'
          }
        },
        read: {
          models: {
            ollama: {
              model: 'llama2',
              isCustomModel: false,
              customModel: '',
              temperature: 0.7,
              maxTokens: 2048
            },
            openai: { model: 'gpt-4', isCustomModel: false }
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).not.toHaveProperty('openrouter')
      expect(result.providersConfig.openai).toEqual({ 
        apiKey: 'openai-key',
        baseURL: 'https://api.openai.com/v1'
      })
      expect(result.read.models).not.toHaveProperty('ollama')
      expect(result.read.models.openai).toEqual({ model: 'gpt-4', isCustomModel: false })
    })

    it('should handle edge case with only deprecated providers', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: { apiKey: 'or-key' },
          ollama: { baseURL: 'http://localhost:11434/v1' }
        },
        read: {
          models: {
            openrouter: { model: 'meta-llama/llama-2-7b-chat' },
            ollama: { model: 'llama2' }
          }
        },
        translate: {
          models: {
            openrouter: { model: 'meta-llama/llama-2-13b-chat' },
            ollama: { model: 'gemma3:1b' }
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).toEqual({})
      expect(result.read.models).toEqual({})
      expect(result.translate.models).toEqual({})
    })

    it('should handle boolean and numeric values in models correctly', () => {
      const oldConfig = {
        read: {
          models: {
            openrouter: true,
            ollama: 42,
            openai: { model: 'gpt-4' }
          }
        },
        translate: {
          models: {
            openrouter: false,
            ollama: 0,
            deepseek: { model: 'deepseek-chat' }
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.read.models).not.toHaveProperty('openrouter')
      expect(result.read.models).not.toHaveProperty('ollama')
      expect(result.read.models.openai).toEqual({ model: 'gpt-4' })
      expect(result.translate.models).not.toHaveProperty('openrouter')
      expect(result.translate.models).not.toHaveProperty('ollama')
      expect(result.translate.models.deepseek).toEqual({ model: 'deepseek-chat' })
    })

    it('should handle array values in provider configurations', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: {
            supportedModels: ['meta-llama/llama-2-7b-chat', 'meta-llama/llama-2-13b-chat']
          },
          openai: {
            supportedModels: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o-mini']
          }
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).not.toHaveProperty('openrouter')
      expect(result.providersConfig.openai).toEqual({
        supportedModels: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o-mini']
      })
    })

    it('should handle config matching the example v009 structure', () => {
      // This test uses a structure similar to the v009 example from the context
      const oldConfig = {
        language: {
          detectedCode: 'eng',
          sourceCode: 'auto',
          targetCode: 'jpn',
          level: 'intermediate'
        },
        providersConfig: {
          openai: {
            apiKey: 'openai-key',
            baseURL: 'https://api.openai.com/v1'
          },
          deepseek: {
            apiKey: undefined,
            baseURL: 'https://api.deepseek.com/v1'
          },
          openrouter: {
            apiKey: undefined,
            baseURL: 'https://openrouter.ai/api/v1'
          },
          ollama: {
            apiKey: undefined,
            baseURL: 'http://127.0.0.1:11434/v1'
          }
        },
        read: {
          provider: 'openai',
          models: {
            openai: {
              model: 'gpt-4o-mini',
              isCustomModel: true,
              customModel: 'gpt-4.1-nano'
            },
            deepseek: {
              model: 'deepseek-chat',
              isCustomModel: false,
              customModel: ''
            }
          }
        },
        translate: {
          provider: 'microsoft',
          models: {
            microsoft: null,
            google: null,
            openai: {
              model: 'gpt-4o-mini',
              isCustomModel: true,
              customModel: 'gpt-4.1-nano'
            },
            deepseek: {
              model: 'deepseek-chat',
              isCustomModel: false,
              customModel: ''
            },
            openrouter: {
              model: 'meta-llama/llama-4-maverick:free',
              isCustomModel: false,
              customModel: ''
            },
            ollama: {
              model: 'gemma3:1b',
              isCustomModel: false,
              customModel: ''
            }
          },
          node: {
            enabled: true,
            hotkey: 'Control'
          },
          page: {
            range: 'main',
            autoTranslatePatterns: ['news.ycombinator.com']
          },
          promptsConfig: {
            prompt: 'Read Frog: TRANSLATE_DEFAULT_PROMPT',
            patterns: [
              {
                id: 'Read Frog: TRANSLATE_DEFAULT_PROMPT',
                name: 'Read Frog: TRANSLATE_DEFAULT_PROMPT',
                prompt: 'Treat input as plain text input and translate it into {{targetLang}}, output translation ONLY.'
              }
            ]
          },
          requestQueueConfig: {
            capacity: 300,
            rate: 5
          }
        },
        floatingButton: {
          enabled: true,
          position: 0.66
        },
        sideContent: {
          width: 400
        }
      }

      const result = migrate(oldConfig)

      // Check that deprecated providers are removed
      expect(result.providersConfig).not.toHaveProperty('openrouter')
      expect(result.providersConfig).not.toHaveProperty('ollama')
      
      // Check that valid providers are preserved
      expect(result.providersConfig.openai).toEqual({
        apiKey: 'openai-key',
        baseURL: 'https://api.openai.com/v1'
      })
      expect(result.providersConfig.deepseek).toEqual({
        apiKey: undefined,
        baseURL: 'https://api.deepseek.com/v1'
      })

      // Check that deprecated models are removed from translate
      expect(result.translate.models).not.toHaveProperty('openrouter')
      expect(result.translate.models).not.toHaveProperty('ollama')
      
      // Check that valid models are preserved
      expect(result.translate.models.openai).toEqual({
        model: 'gpt-4o-mini',
        isCustomModel: true,
        customModel: 'gpt-4.1-nano'
      })
      expect(result.translate.models.deepseek).toEqual({
        model: 'deepseek-chat',
        isCustomModel: false,
        customModel: ''
      })
      expect(result.translate.models.microsoft).toBeNull()
      expect(result.translate.models.google).toBeNull()

      // Check that all other properties are preserved
      expect(result.language).toEqual(oldConfig.language)
      expect(result.read.provider).toBe('openai')
      expect(result.translate.provider).toBe('microsoft')
      expect(result.translate.node).toEqual(oldConfig.translate.node)
      expect(result.translate.page).toEqual(oldConfig.translate.page)
      expect(result.translate.promptsConfig).toEqual(oldConfig.translate.promptsConfig)
      expect(result.translate.requestQueueConfig).toEqual(oldConfig.translate.requestQueueConfig)
      expect(result.floatingButton).toEqual(oldConfig.floatingButton)
      expect(result.sideContent).toEqual(oldConfig.sideContent)
    })

    it('should properly clean up undefined values after setting them', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: { apiKey: 'test-key' },
          ollama: { baseURL: 'http://localhost:11434' },
          openai: { apiKey: 'openai-key' }
        },
        read: {
          models: {
            openrouter: { model: 'meta-llama/llama-2-7b-chat' },
            ollama: { model: 'llama2' },
            openai: { model: 'gpt-4' }
          }
        },
        translate: {
          models: {
            openrouter: { model: 'meta-llama/llama-2-13b-chat' },
            ollama: { model: 'gemma3:1b' },
            deepseek: { model: 'deepseek-chat' }
          }
        }
      }

      const result = migrate(oldConfig)

      // Verify that the properties don't exist at all (not just undefined)
      expect('openrouter' in result.providersConfig).toBe(false)
      expect('ollama' in result.providersConfig).toBe(false)
      expect('openrouter' in result.read.models).toBe(false)
      expect('ollama' in result.read.models).toBe(false)
      expect('openrouter' in result.translate.models).toBe(false)
      expect('ollama' in result.translate.models).toBe(false)

      // Verify remaining properties exist
      expect('openai' in result.providersConfig).toBe(true)
      expect('openai' in result.read.models).toBe(true)
      expect('deepseek' in result.translate.models).toBe(true)
    })

    it('should handle migration when read.models or translate.models are undefined after optional chaining', () => {
      const oldConfig = {
        providersConfig: {
          openrouter: { apiKey: 'test-key' }
        },
        read: {
          // no models property
        },
        translate: {
          // no models property
        }
      }

      const result = migrate(oldConfig)

      expect(result.providersConfig).toEqual({})
      expect(result.read.models).toEqual({})
      expect(result.translate.models).toEqual({})
    })
  })
})