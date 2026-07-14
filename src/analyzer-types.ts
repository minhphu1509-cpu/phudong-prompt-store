export type ProviderId = 'openai' | 'gemini' | 'anthropic'

export type AnalysisMode = 'full' | 'context' | 'lighting'

export type ProviderRequest = {
  provider: ProviderId
  model: string
  apiKey: string
}

export type SceneAnalysis = {
  summary: string
  context: {
    spaceType: string
    locationStyle: string
    architecture: string
    materials: string
    landscape: string
    weather: string
    timeOfDay: string
    camera: string
  }
  lighting: {
    primarySource: string
    direction: string
    quality: string
    colorTemperature: string
    contrast: string
    shadows: string
    atmosphere: string
  }
  promptVi: string
  promptEn: string
  negativePrompt: string
  recommendedSettings: {
    aspectRatio: string
    lens: string
    mood: string
  }
}

export type AnalysisResponse = {
  result: SceneAnalysis
  providerUsed: ProviderId
  modelUsed: string
  attempts: Array<{ provider: ProviderId; status: 'failed' | 'success' }>
}
