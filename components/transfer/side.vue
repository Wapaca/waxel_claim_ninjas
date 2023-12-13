<template>
	<div :class="'transfer-side transfer-'+side">
		<h3>{{ side.slice(0, 1).toUpperCase() + side.substr(1)}}</h3>
		<div class="transfer-actor">
			<span>Wallet to use:</span>
			<select v-model="modelTplSelectedActor">
				<option v-for="actor in getActorsList()" :value="actor">{{ actor }}</option>
			</select>
		</div>
		<div class="transfer-nftlist">
			<div class="nftlist">
				<div v-for="asset in waxelTransferStore.getAssets(waxelTransferStore.getSelectedActor(side))" class="nftlist-item">
					{{ asset.name }}
					{{ asset.asset_id }}
					{{ asset.template.template_id }}
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useChainStore } from '@/stores/chain';
import { useWaxelTransferStore } from '@/stores/waxel/transfer';
const chainStore = useChainStore()
const waxelTransferStore = useWaxelTransferStore()

const props = defineProps({
  side: {default: ''},
})

const tplSelectedActor = ref('')
const modelTplSelectedActor = computed({
  get () {return tplSelectedActor.value}, set (value) {tplSelectedActor.value = value}
})

watch(tplSelectedActor, (value) => {
	waxelTransferStore.setSelectedActor(props.side, value);
  waxelTransferStore.loadAssets(value);
});

onMounted(async () => {
})

function getActorsList() {
	let actors = Object.keys(chainStore.sessions);
	actors.sort((a, b) => a.localeCompare(b));
	return actors;
}
</script>