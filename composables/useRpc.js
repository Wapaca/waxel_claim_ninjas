import { APIClient, Serializer } from '@wharfkit/antelope'
import { ContractKit } from '@wharfkit/contract'

import { useChainStore } from '~/stores/chain.js'

export const fetchTable = async(contract, scope, table, objectify = false) => {
	const chainStore = useChainStore()

	if(!chainStore.sessionKit.chains.length)
		throw 'No endpoint available'

	const rpc_endpoint = chainStore.sessionKit.chains[0].url

  try {
    // Create APIClient
    const client = new APIClient({url: rpc_endpoint})
    // Create Kit
    const contractKit = new ContractKit({client})
    // Load contract
    const contractQ = await contractKit.load(contract)
    // Access table and query for all rows
    const rows = (scope !== contract)
      ? await contractQ.table(table).query({ scope: '' + scope }).all() // force convert scope to str to avoid bug
      : await contractQ.table(table).all();

    if(objectify)
      return Serializer.objectify(rows)

    return rows
  }
  catch(e) {
    if(e.code !== undefined) {
      console.log('RPC '+rpc_endpoint+' contract:'+contract+' scope:'+scope+' table:'+table+' failed with code '+e.code);
    }
    else {
      console.log(e)
      console.log('RPC '+rpc_endpoint+' contract:'+contract+' scope:'+scope+' table:'+table);
    }
  }
}