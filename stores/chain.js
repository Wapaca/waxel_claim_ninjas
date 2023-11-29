import { defineStore } from 'pinia'

import { BrowserLocalStorage, SessionKit } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet';
import WebRenderer from '@wharfkit/web-renderer';

export const useChainStore = defineStore('chain', {
  state: () => ({
  	session: null,
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

			this.session = null;

			this.sessionKit.restore().then((s) => {
				this.session = s;
			});
  	},
		async login() {
			const response = await this.sessionKit.login();
			this.session = response.session;
		},
		async logout() {
			await this.sessionKit.logout(this.session);
			this.session = null;
		},
		async transact() {
			if (!this.session) {
				throw new Error('cannot transact without a session');
			}
			const action = {
				account: 'eosio.token',
				name: 'transfer',
				authorization: [this.session.permissionLevel],
				data: {
					from: this.session.actor,
					to: 'teamgreymass',
					quantity: '0.00000001 WAX',
					memo: 'Yay WharfKit! Thank you <3'
				}
			};
			try {
				const trx_result = await this.session.transact({ action })
				console.log(trx_result, 'trx_result')
			}
			catch(e) {
				console.log('error caught in transact', e);
			}
		}
  },
  getters: {

  }
})