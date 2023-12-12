<template>
	<div class="waxel">
		<ClientOnly>
			<div class="waxel-actors">
				<div v-if="Object.keys(chainStore.sessions).length" class="waxel-actors-list">
					<div v-for="actor in Object.keys(chainStore.sessions)" class="waxel-actors-list-item">
						<div class="item-label">{{ actor }} ({{ waxelStore.getNinjasAmount(actor) }} ninja{{ ((waxelStore.getNinjasAmount(actor) > 1) ? 's' : '') }}) <span @click="chainStore.logout(actor)">Remove</span></div>
						<div v-if="waxelStore.ninjasList[actor] !== undefined" class="item-ninjas-list">
							<div v-for="ninja in waxelStore.ninjasList[actor]" class="ninjas-list-item">
								<div class="item-label">{{ ninja.race }} (<a :href="'https://wax.atomichub.io/explorer/asset/wax-mainnet/Waxel-Ninja-0000_'+ninja.asset_id" target="_blank">{{ ninja.asset_id }}</a>)</div>
								<div class="item-content">
									<div v-if="waxelStore.getNinjaStep(ninja) === 'searching'">
										<div v-if="waxelStore.getNinjaClaimTimeleft(ninja) > 0">{{ formatDurationSeconds(precise(waxelStore.getNinjaClaimTimeleft(ninja) - timer, 0) ) }}</div>
										<button v-else-if="chainStore.isLoggedActor(actor)" @click="chainWaxelStore.claimTransact(actor, [ninja.asset_id])">CLAIM</button>
										<button class="disabled" v-else>CLAIM</button>
									</div>
									<button v-else-if="chainStore.isLoggedActor(actor)" @click="chainWaxelStore.searchTransact(actor, [ninja.asset_id])">SEARCH</button>
									<button class="disabled" v-else>SEARCH</button>
								</div>
							</div>
						</div>
						<div v-else>
							<span>Go on <a href="https://play.waxel.net/ww/index.html" target="_blank">Waxel game</a> to stake your ninjas</span>
						</div>
						<div v-if="waxelStore.ninjasList[actor] !== undefined" class="item-actions">
							<button v-if="chainStore.isLoggedActor(actor) && waxelStore.getSearchableAssetIds(actor).length" @click="chainWaxelStore.searchTransact(actor, waxelStore.getSearchableAssetIds(actor))">SEARCH ALL ({{waxelStore.getSearchableAssetIds(actor).length}})</button>
							<button v-else class="disabled">SEARCH ALL ({{waxelStore.getSearchableAssetIds(actor).length}})</button>
							<button v-if="chainStore.isLoggedActor(actor) && waxelStore.getClaimableAssetIds(actor).length" @click="chainWaxelStore.claimTransact(actor, waxelStore.getClaimableAssetIds(actor))">CLAIM ALL ({{waxelStore.getClaimableAssetIds(actor).length}})</button>
							<button v-else class="disabled">CLAIM ALL ({{waxelStore.getClaimableAssetIds(actor).length}})</button>
						</div>
					</div>
				</div>
				<div v-else class="waxel-actors-list">
					Add an account by connecting
				</div>
			</div>

		</ClientOnly>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { useChainStore } from '@/stores/chain'
import { useWaxelStore } from '@/stores/waxel'
import { useChainWaxelStore } from '@/stores/chain/waxel'
import { precise, formatDurationSeconds } from '~/composables/utils.js';

const chainStore = useChainStore()
const waxelStore = useWaxelStore()
const chainWaxelStore = useChainWaxelStore()

const timer = ref(0)

onMounted(async () => {
  await waxelStore.init()
  setInterval(() => ++timer.value, 1000)
})
</script>