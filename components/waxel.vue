<script setup>
	import { useWaxelStore } from '@/stores/waxel'

	const waxelStore = useWaxelStore()
</script>
<template>
	<div>
		TEST {{ waxelStore.getTest() }}
	</div>
</template>