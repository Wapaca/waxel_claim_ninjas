import { defineStore } from 'pinia'
import { useChainStore } from '~/stores/chain.js';
import { fetchTable } from '~/composables/useRpc.js';
import { parseDateFromSmartcontract } from '~/composables/utils.js';

export const useWaxelStore = defineStore('waxel', {
  state: () => ({
    actors: [],
    ninjas: [],
    ninjasList: []
  }),
  actions: {
    async init() {
      this.initActors()
      this.initNinjas()
    },
    initActors() {
      const chainStore = useChainStore()

      if(chainStore.session) {
        this.actors.push(chainStore.session.actor.toString())
      }
    },
    async initNinjas() {
      const ninjasFetch = await fetchTable('waxelworldsc', 'waxelworldsc', 'ninjas', true);
      this.ninjas = ninjasFetch.map(n => {
        n.last_search = parseDateFromSmartcontract(n.last_search)

        return n;
      })
      this.ninjasList = this.ninjas.filter(n => this.actors.includes(n.owner))
    }
  },
  getters: {
  }
})