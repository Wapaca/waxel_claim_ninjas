import { defineStore } from 'pinia'
import { useChainStore } from '~/stores/chain.js'
import { useWaxelNinjasStore } from '~/stores/waxel/ninjas.js'

export const useChainWaxelStore = defineStore('chainWaxel', {
  state: () => ({

  }),
  actions: {
  	async transferAssets(fromActor, toActor, asset_ids) {
			const chainStore = useChainStore();
			chainStore.transact({
				actor: fromActor,
				actions: this.getTransferAssetsActions(fromActor, toActor, asset_ids)
			})
  	},
		async searchTransact(actor, asset_ids) {
			const chainStore = useChainStore();
			const waxelStore = useWaxelNinjasStore();
			chainStore.transact({
				actor,
				actions: this.getSearchActions(actor, asset_ids),
				updateAction: () => waxelStore.initNinjas(),
				updateDelay: 4000,
			})
		},
		async claimTransact(actor, asset_ids) {
			const chainStore = useChainStore();
			const waxelStore = useWaxelNinjasStore();
			chainStore.transact({
				actor,
				actions: this.getClaimActions(actor, asset_ids),
				updateAction: () => waxelStore.initNinjas(),
				updateDelay: 4000,
			})
		}
  },
  getters: {
  	getTransferAssetsActions: () => (fromActor, toActor, asset_ids) => {
  		const chainStore = useChainStore();

  		return [{
  			account: 'atomicassets',
				name: 'transfer',
				authorization: [chainStore.sessions[fromActor].permissionLevel],
				data: {
					from: fromActor,
					to: toActor,
					asset_ids,
					memo: '',
				},
  		}]
  	},
  	getSearchActions: () => (actor, asset_ids) => {
  		const chainStore = useChainStore();

  		const actions = []
			actions.push({
				account: 'waxelworldsc',
				name: 'startsearch',
				authorization: [chainStore.sessions[actor].permissionLevel],
				data: {
					account: actor,
					asset_ids
				}
			});

			return actions
  	},
  	getClaimActions: () => (actor, asset_ids) => {
  		const chainStore = useChainStore();

  		const actions = []
			actions.push({
				account: 'waxelworldsc',
				name: 'searchforcz',
				authorization: [chainStore.sessions[actor].permissionLevel],
				data: {
					account: actor,
					asset_ids
				}
			});

			return actions
  	},
  }
})