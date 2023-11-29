import { defineStore } from 'pinia'

export const useWaxelStore = defineStore('waxel', {
  state: () => ({

  }),
  actions: {

  },
  getters: {
  	getTest: () => () => {
  		return "it works !!!"
  	}
  }
})