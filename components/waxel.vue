<template>
	<div class="waxel">
		<ClientOnly>
			<div class="waxel-actors">
				<div v-if="Object.keys(chainStore.sessions).length" class="waxel-actors-list">
					<div v-for="actor in Object.keys(chainStore.sessions)" class="waxel-actors-list-item">
						<div class="item-label">{{ actor }} ({{ waxelNinjasStore.getNinjasAmount(actor) }} ninja{{ ((waxelNinjasStore.getNinjasAmount(actor) > 1) ? 's' : '') }}) <span @click="chainStore.logout(actor)">Remove</span></div>
						<div v-if="waxelNinjasStore.ninjasList[actor] !== undefined" class="item-ninjas-list">
							<div v-for="ninja in waxelNinjasStore.ninjasList[actor]" class="ninjas-list-item">
								<div class="item-label">{{ ninja.race }} (<a :href="'https://wax.atomichub.io/explorer/asset/wax-mainnet/Waxel-Ninja-0000_'+ninja.asset_id" target="_blank">{{ ninja.asset_id }}</a>)</div>
								<div class="item-content">
									<div v-if="waxelNinjasStore.getNinjaStep(ninja) === 'searching'">
										<div v-if="waxelNinjasStore.getNinjaClaimTimeleft(ninja) > 0">{{ formatDurationSeconds(precise(waxelNinjasStore.getNinjaClaimTimeleft(ninja) - timer, 0) ) }}</div>
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
						<div v-if="waxelNinjasStore.ninjasList[actor] !== undefined" class="item-actions">
							<button v-if="chainStore.isLoggedActor(actor) && waxelNinjasStore.getSearchableAssetIds(actor).length" @click="chainWaxelStore.searchTransact(actor, waxelNinjasStore.getSearchableAssetIds(actor))">SEARCH ALL ({{waxelNinjasStore.getSearchableAssetIds(actor).length}})</button>
							<button v-else class="disabled">SEARCH ALL ({{waxelNinjasStore.getSearchableAssetIds(actor).length}})</button>
							<button v-if="chainStore.isLoggedActor(actor) && waxelNinjasStore.getClaimableAssetIds(actor).length" @click="chainWaxelStore.claimTransact(actor, waxelNinjasStore.getClaimableAssetIds(actor))">CLAIM ALL ({{waxelNinjasStore.getClaimableAssetIds(actor).length}})</button>
							<button v-else class="disabled">CLAIM ALL ({{waxelNinjasStore.getClaimableAssetIds(actor).length}})</button>
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
import { useWaxelNinjasStore } from '@/stores/waxel/ninjas'
import { useChainWaxelStore } from '@/stores/chain/waxel'
import { precise, formatDurationSeconds } from '~/composables/utils.js';

const chainStore = useChainStore()
const waxelNinjasStore = useWaxelNinjasStore()
const chainWaxelStore = useChainWaxelStore()

const timer = ref(0)

onMounted(async () => {
  await waxelNinjasStore.init()
  setInterval(() => ++timer.value, 1000)
})
</script>