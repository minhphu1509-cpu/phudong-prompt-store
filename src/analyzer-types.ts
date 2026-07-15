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
    sceneType: string
    setting: string
    backgroundElements: string
    groundCondition: string
    vegetation: string
    weather: string
    timeOfDay: string
    atmosphere: string
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
    mood: string
  }
}

export type AnalysisResponse = {
  result: SceneAnalysis
  providerUsed: ProviderId
  modelUsed: string
  attempts: Array<{ provider: ProviderId; status: 'failed' | 'success'; model?: string; error?: string }>
}
