import { defineStore } from 'pinia'
import { useChainStore } from '~/stores/chain.js'
import { useWaxelStore } from '~/stores/waxel.js'

export const useChainWaxelStore = defineStore('chainWaxel', {
  state: () => ({

  }),
  actions: {
		async searchTransact(asset_ids) {
			const chainStore = useChainStore();
			const waxelStore = useWaxelStore();
			chainStore.transact({
				actions: this.getSearchActions(asset_ids),
				updateAction: () => waxelStore.initNinjas(),
				updateDelay: 4000,
			})
		},
		async claimTransact(asset_ids) {
			const chainStore = useChainStore();
			const waxelStore = useWaxelStore();
			chainStore.transact({
				actions: this.getClaimActions(asset_ids),
				updateAction: () => waxelStore.initNinjas(),
				updateDelay: 4000,
			})
		}
  },
  getters: {
  	getSearchActions: () => (asset_ids) => {
  		const chainStore = useChainStore();

  		const actions = []
			actions.push({
				account: 'waxelworldsc',
				name: 'startsearch',
				authorization: [chainStore.session.permissionLevel],
				data: {
					account: chainStore.session.actor,
					asset_ids
				}
			});

			return actions
  	},
  	getClaimActions: () => (asset_ids) => {
  		const chainStore = useChainStore();

  		const actions = []
			actions.push({
				account: 'waxelworldsc',
				name: 'searchforcz',
				authorization: [chainStore.session.permissionLevel],
				data: {
					account: chainStore.session.actor,
					asset_ids
				}
			});

			return actions
  	},
  }
})