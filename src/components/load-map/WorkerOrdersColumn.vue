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
			<OrderCard :order="element" @click="cardStaticClick(element)" :smallSize="false"/>
		</template>
	</draggable>
</template>

<script lang="ts">
import Order from '@/assets/order';
import User from '@/assets/user';
import { computed } from 'vue';
import OrderCard from './OrderCard.vue';
import draggable from 'vuedraggable'
import TMS from '@/api/tms';

export default {
	name: "WorkerOrdersColumn",
	props: {
		worker: {
			type: User,
			required: true,
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
		const replaceIsDisable = computed(() => props.replaceIsDisable)
		const replaceIsValid = computed(() => props.replaceIsValid)
		const worker = computed(() => props.worker)

		const workerOrders = computed(() => props.orders)

		const log = (data:any) => {
			if (data["removed"]) return 
			if (!replaceIsValid.value) return

			// Get data about replaced order
			let order:Order = data["added"]["element"]

			
			TMS.order().setWorker(order.orderId, worker.value.id).then((response) => {
				if (response.data.err) throw response.data.err

				order.worker = new User(response.data["worker"])
				order.statusId = response.data["statusId"]
			})
		}

		return {
			workerOrders,
			log,
			replaceIsDisable,
			cardStaticClick,
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