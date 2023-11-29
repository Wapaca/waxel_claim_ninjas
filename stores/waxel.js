import { defineStore } from 'pinia'
import { useChainStore } from '~/stores/chain.js';
import { fetchTable } from '~/composables/useRpc.js';
import { parseDateFromSmartcontract } from '~/composables/utils.js';

export const useWaxelStore = defineStore('waxel', {
  state: () => ({
    actors: [],
    ninjas: [],
    ninjasList: {} // ninjasList sorted by actors
  }),
  actions: {
    async init() {
      this.initActors()
      this.initNinjas()
    },
    initActors() {
      this.actors = []
      if(process.client) {
        const jsonActors = localStorage.getItem("waxelStore-actors");
        if(jsonActors)
          this.actors = JSON.parse(jsonActors)
      }

      this.addConnectedActor()
    },
    addConnectedActor() {
      const chainStore = useChainStore()

      if(chainStore.session) {
        const connected = chainStore.session.actor.toString()

        if(!this.actors.includes(connected))
          this.actors.push(connected)
      }

      this.saveActors()
    },
    saveActors() {
      if(process.client)
        localStorage.setItem("waxelStore-actors", JSON.stringify(this.actors))
    },
    async initNinjas() {
      const ninjasFetch = await fetchTable('waxelworldsc', 'waxelworldsc', 'ninjas', true);
      this.ninjas = ninjasFetch.map(n => {
        n.last_search = parseDateFromSmartcontract(n.last_search)

        return n;
      })

      /*** Different ninjas status 
        0: "Searching"
        1: "Search successful"
        2: "holdup1"
        3: "Search failed"
        4: "Idle"
        5: "holdup"
      **/

      this.updateNinjasList()
    },
    updateNinjasList() {
      this.ninjasList = {}
      for(const ninja of this.ninjas) {
        if(this.ninjasList[ninja.owner] === undefined)
          this.ninjasList[ninja.owner] = []

        this.ninjasList[ninja.owner].push(ninja)
      }
    }
  },
  getters: {
  }
})