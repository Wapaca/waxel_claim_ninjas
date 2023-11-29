<template>
	<div class="waxel">
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

			<div class="waxel-actors">
				<div class="waxel-actors-list">
					<div v-for="actor in waxelStore.actors" class="waxel-actors-list-item">
						<div class="item-label">{{ actor }}</div>
						<div v-if="waxelStore.ninjasList[actor] !== undefined" class="item-ninjas-list">
							<div v-for="ninja in waxelStore.ninjasList[actor]" class="ninjas-list-item">
								<div>{{ ninja.asset_id }}</div>
								<div>{{ ninja.delay_seconds }}</div>
								<div>{{ ninja.last_search }}</div>
								<div>{{ ninja.owner }}</div>
								<div>{{ ninja.race }}</div>
								<div>{{ ninja.status }}</div>
								<hr>
							</div>
						</div>
						<div v-else>
							<span>Go on <a href="https://play.waxel.net/ww/index.html" target="_blank">Waxel game</a> to stake your ninjas</span>
						</div>
					</div>
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