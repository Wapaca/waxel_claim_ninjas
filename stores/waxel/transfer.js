import { defineStore } from 'pinia'

import { loadAllUserAssets } from '@/composables/useAtomic.js';

export const useWaxelTransferStore = defineStore('transfer', {
  state: () => ({
  	assets: {},
  	selectedActor: {},
  	whitelistedTemplates: [
  		540991, // Citizens - 10x
  		606491, // Old Book Page - 1x
		],
  }),
  actions: {
  	setSelectedActor(side, actor) {
  		this.selectedActor[side] = actor
  	},
  	async loadAssets(actor) {
			const assets = await loadAllUserAssets('waxelninjas1', actor);
			this.assets[actor] = assets.filter(a => this.whitelistedTemplates.includes(Number(a.template.template_id)));
  	}
  },
  getters: {
  	getSelectedActor: () => (side) => {
			const thisStore = useWaxelTransferStore();
			if(thisStore.selectedActor[side] === undefined)
				return null

			return thisStore.selectedActor[side];
  	},
  	getAssets: () => (actor) => {
  		const thisStore = useWaxelTransferStore();
  		if(thisStore.assets[actor] === undefined)
  			return []

  		return thisStore.assets[actor];
  	}
  }
})