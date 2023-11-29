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
      await this.initNinjas()
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
    getNinjaStep: () => (ninja) => {
      //return 'searching' or 'standing'
      /*** Different ninjas status 
        0: "Searching"
        1: "Search successful"
        2: "holdup1"
        3: "Search failed"
        4: "Idle"
        5: "holdup"
      **/

      if(['Search successful', 'Search failed', 'Idle'].includes(ninja.status))
        return 'standing';

      return 'searching'
    },
    getNinjaClaimTimeleft: () => (ninja) => {
      const thisStore = useWaxelStore()
      if(thisStore.getNinjaStep(ninja) !== 'searching')
        return 0;

      return Math.max(0, (ninja.last_search.getTime() + (ninja.delay_seconds * 1000)) - Date.now() ) / 1000
    },
    getNinjasAmount: (state) => (actor) => {
      if(state.ninjasList[actor] === undefined)
        return 0

      return state.ninjasList[actor].length
    }
  }
})