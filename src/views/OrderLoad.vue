<template>
	<ion-page>
		<ion-content>
			<div class="order-load" v-if="filters.date">
				<DateViewer v-model:date="filters.date"/>
				<div class="map">
					<OrderLoadMap :orders="orders" :date="filters.date" :workersWithHoliday="data.workersWithHoliday"/>
				</div>
			</div>		
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';	
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OrderLoadMap from '@/components/load-map/OrderLoadMap.vue';
import DateViewer from '@/components/DateViewer.vue';
import { useStore } from 'vuex';
import { newOrderListFilters } from '@/assets/orderListFilters';
import TMS from '@/api/tms';
import Order from '@/assets/order';

export default {
	name: "OrderLoad",
	components: {
		IonPage,
		IonContent,
		OrderLoadMap,
		DateViewer,
	},
	setup(){
		const store = useStore()
		const router = useRouter()
		const orders = computed(() => store.getters.orderMap)

		const data = reactive<{
			workersWithHoliday: Array<number>
		}>({
			workersWithHoliday: [],
		})

		const filters = newOrderListFilters()
		store.dispatch("ws-update-filters", filters)

		const updateOrders = () => {
			store.dispatch('setup-order-map', filters)
			if (!filters.date) return
			TMS.user().holidayList(filters.date).then((response) => {

				if (response.data && response.data.err) throw response.data.err

				data.workersWithHoliday = response.data ?? []
			})
		}

		updateOrders()
		watch(filters, (() => {
			const newFiltersQuery = filters.toPageUrlQuery()
			router.push({
				name: "load",
				query: newFiltersQuery,
			})

			store.dispatch("ws-update-filters", filters)
			updateOrders()
		}))

		watch(router.currentRoute, (currentRoute, oldRoute) => {
			if (currentRoute.name == "load" && currentRoute.name != oldRoute.name ) {
				store.dispatch("ws-update-filters", filters)
				updateOrders()
			}
		})

		return {
			filters,
			data,
			orders
		}
	}
}
</script>

<style  scoped>
.order-load{
	height: calc(100% - 56px);
	padding: 0 10px;
	display: grid;
	grid-template-rows: 66px calc(100% - 16px);
}

.map {
	
	overflow-x: auto;
}
</style>