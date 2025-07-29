/**
 * Migrates a configuration object by removing all references to the "openrouter" and "ollama" providers.
 *
 * All occurrences of "openrouter" and "ollama" are deleted from the `providersConfig`, `read.models`, and `translate.models` sections of the configuration. All other properties are preserved.
 *
 * @param oldConfig - The original configuration object to migrate
 * @returns A new configuration object with "openrouter" and "ollama" providers removed
 */
export function migrate(oldConfig: any): any {
  // Remove OpenRouter and Ollama providers completely
  const newConfig = {
    ...oldConfig,
    providersConfig: {
      ...oldConfig.providersConfig,
      openrouter: undefined,
      ollama: undefined,
    },
    read: {
      ...oldConfig.read,
      models: {
        ...oldConfig.read?.models,
        openrouter: undefined,
        ollama: undefined,
      },
    },
    translate: {
      ...oldConfig.translate,
      models: {
        ...oldConfig.translate?.models,
        openrouter: undefined,
        ollama: undefined,
      },
    },
  }

  // Clean up undefined values
  if (newConfig.providersConfig.openrouter === undefined) {
    delete newConfig.providersConfig.openrouter
  }
  if (newConfig.providersConfig.ollama === undefined) {
    delete newConfig.providersConfig.ollama
  }
  if (newConfig.read.models?.openrouter === undefined) {
    delete newConfig.read.models.openrouter
  }
  if (newConfig.read.models?.ollama === undefined) {
    delete newConfig.read.models.ollama
  }
  if (newConfig.translate.models?.openrouter === undefined) {
    delete newConfig.translate.models.openrouter
  }
  if (newConfig.translate.models?.ollama === undefined) {
    delete newConfig.translate.models.ollama
  }

  return newConfig
}
