<template>
	<div>
		<ClientOnly>
			<div>
				<div v-if="chainStore.session">
					<span>{{ chainStore.session.actor }} connected</span>
					<button @click="chainStore.transact">Transact test</button>
				</div>
				<button v-else @click="chainStore.login">Login</button>
			</div>
			<hr>
			<div>
				<button @click="chainStore.logout">Logout</button>
			</div>

			<hr>
			<hr>
			<hr>

			<div class="ninjas-list">
				<div v-for="ninja in waxelStore.ninjasList" class="ninjas-list-item">
					<div>{{ ninja.asset_id }}</div>
					<div>{{ ninja.delay_seconds }}</div>
					<div>{{ ninja.last_search }}</div>
					<div>{{ ninja.owner }}</div>
					<div>{{ ninja.race }}</div>
					<div>{{ ninja.status }}</div>
					<hr>
				</div>
			</div>
		</ClientOnly>
	</div>
</template>
<script setup>
import { useChainStore } from '@/stores/chain';
import { useWaxelStore } from '@/stores/waxel'

const chainStore = useChainStore()
const waxelStore = useWaxelStore()

onMounted(() => {
  waxelStore.init()
})
</script>