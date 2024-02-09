import { useChainStore } from '@/stores/chain';

export default defineNuxtPlugin({
  name: 'startapp',
  enforce: 'pre', // or 'post'
  hooks: {
    // You can directly register Nuxt app runtime hooks here
    async 'app:created'() {
      const chainStore = useChainStore();
      await chainStore.init()
    }
  },
})