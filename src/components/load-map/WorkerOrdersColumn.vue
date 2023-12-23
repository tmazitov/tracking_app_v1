<template>
	<draggable 
	:id="`worker-${worker.id}`"
	tag="div" class="worker-orders-column"
	:list="workerOrders"
	:disabled="replaceIsDisable"
	@change="log"	
	itemKey="orderId"
	group="orders"> 
		<template #item="{element}" >
			<OrderCard :order="element" 
				@click="cardStaticClick(element)" 
				:smallSize="false" 
				:workerWorkTime="workerWorkTime"/>
		</template>
	</draggable>
</template>

<script lang="ts">
import Order from '@/assets/order';
import User from '@/assets/user';
import { computed, toRaw } from 'vue';
import OrderCard from './OrderCard.vue';
import draggable from 'vuedraggable'
import TMS from '@/api/tms';
import StaffWorkTime from '@/assets/staffWorkTime';

export default {
	name: "WorkerOrdersColumn",
	props: {
		worker: {
			type: User,
			required: true,
		},
		workerWorkTime: {
			type: StaffWorkTime,
			default: null,
		},
		orders: {
			type: Array<Order>,
			required: true,
		},
		replaceIsDisable: {
			type: Boolean,
			required: true,
		},
		replaceIsValid: {
			type: Boolean,
			default: false,
		},
		cardStaticClick: {
			type: Function,
			required: true,
		}
	},
	components:{
		draggable,
		OrderCard,
	},
	setup(props){
		const cardStaticClick = computed(() => props.cardStaticClick)
		const workerWorkTime = computed(() => props.workerWorkTime)
		const replaceIsDisable = computed(() => props.replaceIsDisable)
		const replaceIsValid = computed(() => props.replaceIsValid)
		const worker = computed(() => props.worker)

		const workerOrders = computed(() => props.orders.filter(order => {
			return order.worker && order.worker.id == worker.value.id}))

		const log = (data:any) => {
			if (data["removed"]) return 
			if (!replaceIsValid.value) return
			// Get data about replaced order
			let orderProxy:Order = data["added"]["element"]
			let order:Order = toRaw(orderProxy)
			TMS.order().setWorker(order.orderId, worker.value.id).then((response) => {
				if (response.data.err) throw response.data.err

				orderProxy.worker = new User(response.data["worker"])
				orderProxy.statusId = response.data["statusId"]
			})
		}

		return {
			workerOrders,
			log,
			replaceIsDisable,
			cardStaticClick,
			workerWorkTime,
		}
	}
}
</script>

<style scoped>
.worker-orders-column{
	height: inherit;
	width: 97px;
}
.worker-orders-column:last-child{
	width: 98px;
}
</style>