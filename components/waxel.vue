<template>
	<div class="waxel">
		<ClientOnly>
			<div class="waxel-actors">
				<div class="waxel-actors-list">
					<div v-for="actor in waxelStore.actors" class="waxel-actors-list-item">
						<div class="item-label">{{ actor }} ({{ waxelStore.getNinjasAmount(actor) }} ninja{{ ((waxelStore.getNinjasAmount(actor) > 1) ? 's' : '') }})</div>
						<div v-if="waxelStore.ninjasList[actor] !== undefined" class="item-ninjas-list">
							<div v-for="ninja in waxelStore.ninjasList[actor]" class="ninjas-list-item">
								<div class="item-label">{{ ninja.race }} (<a :href="'https://wax.atomichub.io/explorer/asset/wax-mainnet/Waxel-Ninja-0000_'+ninja.asset_id" target="_blank">{{ ninja.asset_id }}</a>)</div>
								<div class="item-content">
									<div v-if="waxelStore.getNinjaStep(ninja)">
										<div v-if="waxelStore.getNinjaClaimTimeleft(ninja) > 0">{{ formatDurationSeconds(precise(waxelStore.getNinjaClaimTimeleft(ninja) - timer, 0) ) }} seconds</div>
										<div v-else>CLAIM</div>
									</div>
									<div v-else>SEARCH</div>
								</div>
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
import { ref } from 'vue'
import { useWaxelStore } from '@/stores/waxel'
import { precise, formatDurationSeconds } from '~/composables/utils.js';
const waxelStore = useWaxelStore()

const timer = ref(0)

onMounted(async () => {
  await waxelStore.init()
  setInterval(() => ++timer.value, 1000)
})
</script>