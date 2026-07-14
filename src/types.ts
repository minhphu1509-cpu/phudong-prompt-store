export type LinkInfo = { name: string; url: string }

export type PromptItem = {
  id: string
  number: number
  title: string
  rawTitle: string
  category: string
  description: string
  prompt: string
  images: string[]
  author: LinkInfo | null
  source: LinkInfo | null
  published: string
  language: string
  tryLink: string
  featured: boolean
  raycastFriendly: boolean
}
