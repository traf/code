export default defineAppConfig({
  myLayer: {
    name: 'Obsidian Theme'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myLayer?: {
      /** Project name */
      name?: string
    }
  }
}
