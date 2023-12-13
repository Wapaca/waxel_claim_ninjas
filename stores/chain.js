import { defineStore } from 'pinia'

import { BrowserLocalStorage, SessionKit } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet';
import WebRenderer from '@wharfkit/web-renderer';

export const useChainStore = defineStore('chain', {
  state: () => ({
  	sessions: {},
  	currentActor: null,
  	sessionKit: null
  }),
  actions: {
  	async init() {
  		const ui = (process.client) ? new WebRenderer() : null;
			const authStorageKey = 'waxel_ninjas_claim-auth';

			this.sessionKit = new SessionKit({
				appName: 'waxel_ninjas_claim',
				chains: [{
					id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
			    url: 'https://wax.greymass.com',
				}],
				storage: new BrowserLocalStorage(authStorageKey),
				ui,
				walletPlugins: [new WalletPluginAnchor(), new WalletPluginCloudWallet()]
			});

      const sessions = await this.sessionKit.restoreAll();
      this.sessions = {}
      for(const s of sessions) {
      	const actor = s.actor.toString();
      	this.currentActor = actor;
      	this.sessions[actor] = s;
      }
  	},
		async login() {
			const response = await this.sessionKit.login();
			const actor = response.session.actor.toString();
			this.currentActor = actor;
			this.sessions[actor] = response.session;
			this.saveSessions()
			this.afterLoginHook();
		},
		afterLoginHook() {
		},
		async logout(actor) {
			if(actor === undefined)
				actor = this.currentActor;

			if(actor === null)
				return;

			await this.sessionKit.logout(this.sessions[actor]);
			this.removeSession(actor)
			this.currentActor = null;
			const currentActors = Object.keys(this.sessions)
			if(currentActors.length)
				this.currentActor = currentActors[currentActors.length - 1]
		},
		removeSession(actor) {
			if(this.sessions[actor] === undefined)
				return;

			delete this.sessions[actor];
			this.saveSessions();
		},
		saveSessions() {
			for(const actor of Object.keys(this.sessions))
				this.sessionKit.persistSession(this.sessions[actor])
		},
		async transact({
			actor,
			actions,
			updateAction,
			quickUpdateAction,
			updateFailedAction,
			updateDelay,
			updateFailedDelay,
		}) {
			let session = null
			if(actor !== undefined) {
				if(this.sessions[actor] !== undefined)
					session =	this.sessions[actor]
				else {
					throw new Error('Requested actor is not in sessions')
					return;
				}
			}

			try {
				const trx_result = await session.transact({ actions })

				if(quickUpdateAction !== undefined)
					quickUpdateAction()

				if(updateAction !== undefined)
					setTimeout(() => updateAction(), updateDelay)

				console.log(trx_result, 'trx_result')
			}
			catch(e) {
				if(updateFailedAction !== undefined)
					setTimeout(() => updateFailedAction(), updateFailedAction)

				console.log('error caught in transact', e);
			}
		}
  },
  getters: {
  	getCurrentSession: () => () => {
			const thisStore = useChainStore()

			if(!Object.keys(thisStore.sessions).length)
  			return null;

  		if(thisStore.sessions[thisStore.currentActor] !== undefined)
  			return null;

  		return thisStore.sessions[thisStore.currentActor];
  	},
  	isLoggedActor: (state) => (actor) => {
  		const thisStore = useChainStore()

  		if(!Object.keys(thisStore.sessions).length)
  			return false;

  		return Object.keys(thisStore.sessions).includes(actor)
  	}
  }
})