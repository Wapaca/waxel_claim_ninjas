import {delay, shuffleArray} from '@/composables/utils.js'

const min_delay = 1000 // min_delay before doing request on same endpoint

let endpoints = shuffleArray([
  {url: 'https://aa.dapplica.io/', lastusage: 0},
  {url: 'https://wax-atomic-api.eosphere.io/', lastusage: 0},
  {url: 'https://atomic-wax.tacocrypto.io/', lastusage: 0},
  {url: 'https://atomic.3dkrender.com/', lastusage: 0},
  {url: 'https://aa.waxdaobp.io/', lastusage: 0},
])

const safeAtomicFetch = async(req) => {
  endpoints.sort((a, b) => a.lastusage - b.lastusage)
  const now = Date.now()

  if(now - endpoints[0].lastusage < min_delay)
    await delay(min_delay - now + endpoints[0].lastusage)

  let ret = null
  const { data, pending, error, refresh } = await useFetch(endpoints[0].url + req, {
    onResponse({ request, response, options }) {
      endpoints[0].lastusage = now
      ret = response._data.data
    },
    async onRequestError({ request, options, error }) {
      console.warn('Request error', error)
      console.info('Retry with another endpoint')
      endpoints[0].lastusage = now
      
    },
    async onResponseError({ request, response, options }) {
      console.warn('Response error')
      console.info('Retry with another endpoint')
      endpoints[0].lastusage = now
    }
  })

  if(ret !== null)
    return ret;
  else
    return await safeAtomicFetch(req)
}
export const loadAllUserAssets = async(collection, wallet, page = 1, prevRows = []) => {
  const limitPerFetch = 1000
  const req = 'atomicassets/v1/assets?collection_name='+collection+
              '&owner='+wallet+'&page='+page+'&limit='+limitPerFetch+'&order=desc&sort=asset_id&nocache='+Date.now()

  const assets = await safeAtomicFetch(req)
  let rows = prevRows.concat(assets)

  if(assets.length === limitPerFetch) {
    ++page
    rows = await loadAllUserAssets(collection, wallet, page, rows)
    return rows
  }
  else
    return rows
}