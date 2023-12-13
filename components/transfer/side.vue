<template>
	<div :class="'transfer-side transfer-'+side">
		<h3>{{ side.slice(0, 1).toUpperCase() + side.substr(1)}}</h3>
		<div class="transfer-actor">
			<span>Wallet to use:</span>
			<select>
				<option v-for="actor in getActorsList(side)" :value="actor">{{ actor }}</option>
			</select>
		</div>
		<div class="transfer-nftlist">
		</div>
	</div>
</template>
<script setup>
import { useChainStore } from '@/stores/chain';
const chainStore = useChainStore()

const props = defineProps({
  side: {default: ''},
})

function getActorsList(side) {
	let actors = Object.keys(chainStore.sessions);
	if(side === 'send')
		actors.sort((a, b) => a.localeCompare(b));
	else
		actors.sort((a, b) => b.localeCompare(a));

	return actors;
}
</script>