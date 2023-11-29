<template>
	<div class="waxelclaim-header">
		<div class="header-logo">WAXEL CLAIM TOOL</div>
		<div class="header-account">
			<div class="account-name">
				<div v-if="chainStore.session">
					<span>{{ chainStore.session.actor }}</span>
				</div>
				<button v-else @click="chainStore.login">Login</button>
			</div>
			<div class="account-logout">
				<button v-if="chainStore.session" @click="chainStore.logout">Logout</button>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useChainStore } from '@/stores/chain';
const chainStore = useChainStore()
</script>