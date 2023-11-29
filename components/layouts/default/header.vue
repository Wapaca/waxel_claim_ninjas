<template>
	<div class="waxelclaim-header">
		<div class="header-logo">WAXEL CLAIM TOOL</div>
		<div class="header-account">
			<div>
				<div v-if="chainStore.session">
					<span>{{ chainStore.session.actor }} connected</span>
					<button @click="chainStore.transact">Transact test</button>
				</div>
				<button v-else @click="chainStore.login">Login</button>
			</div>
			<div>
				<button @click="chainStore.logout">Logout</button>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useChainStore } from '@/stores/chain';
const chainStore = useChainStore()
</script>