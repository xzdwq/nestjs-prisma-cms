<template>
  <Html :lang="locale"></Html>
  <div>
    <div>123</div>
  </div>
</template>

<script setup lang="ts">
import { AppConfigInput } from '@nuxt/schema'

const locale = useState<string>('locale.setting') ?? 'ru'
const app = useAppConfig() as AppConfigInput

useHead({
  title: app.name,
  titleTemplate: '%s - Web',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: 'XCMS Web application',
    },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
})
</script>
