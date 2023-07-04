<template>
	<ion-page>
		<ion-content>
			<div class="order-load" v-if="data.storage.filters.date">
				<DateViewer v-model:date="data.storage.filters.date"/>
				<div class="map">
					<OrderLoadMap 
					v-if="data.staffWorkTime"
					:staffWorkTime="data.staffWorkTime"
					:orders="data.storage.orders" 
					:date="data.storage.filters.date" 
					:workersWithHoliday="data.workersWithHoliday"/>
				</div>
			</div>		
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, onIonViewWillEnter } from '@ionic/vue';	
import OrderLoadMap from '@/components/load-map/OrderLoadMap.vue';
import DateViewer from '@/components/DateViewer.vue';
import TMS from '@/api/tms';
import OrderStorage from '@/assets/orderStorage';
import storage from '@/storage';
import { reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import StaffWorkTime from '@/assets/staffWorkTime';

export default {
	name: "OrderLoad",
	components: {
		IonPage,
		IonContent,
		OrderLoadMap,
		DateViewer,
	},
	setup(){
		const router = useRouter()

		const data = reactive<{
			storage: OrderStorage
			workersWithHoliday: Array<number>
			staffWorkTime: StaffWorkTime|null
		}>({
			storage: new OrderStorage(),
			workersWithHoliday: [],
			staffWorkTime: null,
		})

		onIonViewWillEnter(() => {
			data.storage.updateOrders().then(() => {
				if (!data.storage.filters.date) return
				TMS.user().holidayList(data.storage.filters.date).then((response) => {
					if (response.data && response.data.err) throw response.data.err

					data.workersWithHoliday = response.data ?? []
				})
			})

			TMS.user().getStaffWorkTime().then((response) =>{
				if (!response.data) return
				if (response.data.err) throw response.data.err

				data.staffWorkTime = new StaffWorkTime(response.data)
			}) 
		})


		watch(data.storage.filters, () => {
			data.storage.onFilterUpdate().then((newPageQuery:{[key:string]:any}) => {
				router.push({
					name: "load",
					query: newPageQuery,
				})
				if (!data.storage.filters.date) return
				TMS.user().holidayList(data.storage.filters.date).then((response) => {
					if (response.data && response.data.err) throw response.data.err

					data.workersWithHoliday = response.data ?? []
				})
			})
		})

		return {
			data,
			storage
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