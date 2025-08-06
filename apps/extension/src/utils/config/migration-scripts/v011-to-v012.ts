export function migrate(oldConfig: any): any {
  // Integrate Translation Node Style
  const newConfig = {
    ...oldConfig,
    translate: {
      ...oldConfig.translate,
      translationNodeStyle: 'normal',
    },
  }

  return newConfig
}
