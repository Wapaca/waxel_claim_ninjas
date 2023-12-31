import { defineStore } from 'pinia'
import { useChainStore } from '~/stores/chain.js';
import { fetchTable } from '~/composables/useRpc.js';
import { parseDateFromSmartcontract } from '~/composables/utils.js';

export const useWaxelNinjasStore = defineStore('waxel', {
  state: () => ({
    ninjas: [],
    ninjasList: {}, // ninjasList sorted by actors
    users: [], // data from user table
    usersList: {} // users sorted by actors
  }),
  actions: {
    async init() {
      this.initUsers()
      await this.initNinjas()
    },
    async initUsers() {
      const usersFetch = await fetchTable('waxelworldsc', 'waxelworldsc', 'user', true);
      this.users = usersFetch
      this.updateUsersList()
    },
    updateUsersList() {
      this.usersList = {}
      for(const row of this.users)
        this.usersList[row.account] = row;
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
      const thisStore = useWaxelNinjasStore()
      if(thisStore.getNinjaStep(ninja) !== 'searching')
        return 0;

      return Math.max(0, (ninja.last_search.getTime() + (ninja.delay_seconds * 1000)) - Date.now() ) / 1000
    },
    getSearchableAssetIds: (state) => (actor) => {
      if(state.ninjasList[actor] === undefined)
        return []

      const thisStore = useWaxelNinjasStore()

      const asset_ids = []

      for(const ninja of state.ninjasList[actor])
        if(thisStore.getNinjaStep(ninja) === 'standing')
          asset_ids.push(ninja.asset_id)
      
      return asset_ids;
    },
    getClaimableAssetIds: (state) => (actor) => {
      if(state.ninjasList[actor] === undefined)
        return []

      const thisStore = useWaxelNinjasStore()

      const asset_ids = []

      for(const ninja of state.ninjasList[actor])
        if(thisStore.getNinjaStep(ninja) === 'searching' && thisStore.getNinjaClaimTimeleft(ninja) === 0)
          asset_ids.push(ninja.asset_id)
      
      return asset_ids;
    },
    getNinjasAmount: (state) => (actor) => {
      if(state.ninjasList[actor] === undefined)
        return 0

      return state.ninjasList[actor].length
    }
  }
})