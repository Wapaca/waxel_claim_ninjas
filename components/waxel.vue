<script setup>
import { useChainStore } from '@/stores/chain';
import { useWaxelStore } from '@/stores/waxel'

const chainStore = useChainStore()
const waxelStore = useWaxelStore()
</script>
<template>
	<div>
		TEST {{ waxelStore.getTest() }}
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
		</ClientOnly>
	</div>
</template>