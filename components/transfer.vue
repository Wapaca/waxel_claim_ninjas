<template>
	<div class="transfer">
		<h2>Transfer NFT</h2>
		<div class="transfer-templates waxelbox">
			<h3>Templates whitelist</h3>
			<ul>
				<li v-for="tplId in Object.keys(waxelTransferStore.whitelistedTemplates)">{{tplId}} - {{waxelTransferStore.whitelistedTemplates[tplId]}}</li>
			</ul>
		</div>
		<ClientOnly>
			<div v-if="Object.keys(chainStore.sessions).length > 1" class="transfer-box">
				<transferSide side="send"/>
				<transferSide side="receive"/>
			</div>
			<div v-else>
				You need at least two wallets connected to be able to transfer nft
			</div>
			<div class="transfer-actions waxelbox">
				<button v-if="Object.keys(chainStore.sessions).length > 1 && areActorsValid()" @click="chainWaxelStore.transferAssets(waxelTransferStore.getSelectedActor('send'), waxelTransferStore.getSelectedActor('receive'), waxelTransferStore.getAssets(waxelTransferStore.getSelectedActor('send')).map(a => a.asset_id))">Transfer all</button>
				<button v-else class="disabled">Transfer all</button>
			</div>
		</ClientOnly>
	</div>
</template>
<script setup>
import { useChainStore } from '@/stores/chain';
import { useWaxelTransferStore } from '@/stores/waxel/transfer';
import { useChainWaxelStore } from '@/stores/chain/waxel'
const chainStore = useChainStore()
const waxelTransferStore = useWaxelTransferStore()
const chainWaxelStore = useChainWaxelStore()

function areActorsValid() {
	if(waxelTransferStore.getSelectedActor('send') === null || null === waxelTransferStore.getSelectedActor('receive'))
		return false;

	return waxelTransferStore.getSelectedActor('send') !== waxelTransferStore.getSelectedActor('receive')
}
</script>