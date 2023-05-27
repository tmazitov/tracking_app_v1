<template>
	<ion-page>
		<ion-content>
			<div class="order-load">
				<div class="order-load__table" v-for="day, index in days" :key="`day__${index}`">
					<OrderLoadMap 
						:day="day"
					/>
				</div>
			</div>		
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import OrderLoadMap from '@/components/load-map/OrderLoadMap.vue';

export default {
	name: "OrderLoad",
	components: {
		IonPage,
		IonContent,
		OrderLoadMap,
	},
	setup(){
		const route = useRoute()
		const days = computed(() => {
			const d = route.query["d"]
			let currentDate:Date
			if (d) currentDate = new Date(d.toString())	
			else currentDate = new Date() 

			let early:Date = new Date(currentDate.getTime())
			early.setDate(early.getDate() - 1)
			let next:Date = new Date(currentDate.getTime())
			next.setDate(next.getDate() - 1)

			return [
				// early,
				currentDate,
				// next,
			]
		})
		
		return {
			days
		}
	}
}
</script>

<style  scoped>
.order-load{
}
</style>