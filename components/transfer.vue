<template>
	<div class="transfer">
		<h2>Transfer NFT</h2>
		<div v-if="Object.keys(chainStore.sessions).length > 1" class="transfer-box">
			<transferSide side="send"/>
			<transferSide side="receive"/>
		</div>
		<div v-else>
			You need at least two wallets connected to be able to transfer nft
		</div>
	</div>
</template>
<script setup>
import { useChainStore } from '@/stores/chain';
const chainStore = useChainStore()
</script>