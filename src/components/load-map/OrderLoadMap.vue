<template>
	<div class="order-load-map">
		<!-- Order details modal -->
		<OrderDetails
			v-if="data.orderDetails"
			:order="data.orderDetails"
			:isOpen="data.orderDetailsIsOpen"
			:closer="closeOrderDetails"
		/>

		<!-- Toolbar -->
		<div class="load-map__toolbar" v-if="user.roleId == 3">

			<div class="toolbar__buttons"  v-bind:style="{
				'justify-content' : ordersWithoutWorker.length==0 || data.editMode ? 'flex-end' : 'space-between',
			}">
				<div class="toolbar__orders-without-worker" v-if="ordersWithoutWorker.length && !data.editMode">
					<div>Заявок без водителей :</div>
					<div class="clear-button__value">
						{{ ordersWithoutWorker.length }}
					</div>
				</div>
				<div class="clear-button" v-if="!data.editMode" @click="toggleEditMode">
					<div class="clear-button__label">{{
						ordersWithoutWorker.length>0? 'Распределить' : 'Изменить'
					}}</div>
				</div>
				<div class="clear-button" v-else @click="toggleEditMode">
					<div class="clear-button__label">Закрыть</div>
				</div>
			</div>

			<draggable 
			v-if="data.editMode"
			tag="div" class="toolbar__orders"
			:list="ordersWithoutWorker" 
			@change="log"
			@start="startDrag"
			@move="onDragMove"
			@end="endDrag"
			itemKey="orderId" 
			group="orders"> 
				<template #item="{element}" >
					<OrderCard 
					:id="element.orderId" 
					:order="element" 
					:smallSize="data.replaceOrder != `${element.orderId}`"
					:valid="data.replaceOrder != `${element.orderId}` ||  data.replaceIsValid"/>
				</template>
			</draggable>
		</div>

		<!-- Map -->
		<div class="load-map__columns">
			<ion-grid v-if="staffWorkTime">
				<ion-row class="row__content header">
					<ion-col size="auto">
						<div class="hour"></div> 
					</ion-col>
					<ion-col class="ceil worker" v-for="worker in workers" :key="`worker_${worker.id}`" size="auto"
					v-bind:class="{
						holiday: workersWithHoliday.includes(worker.id)
					}">
						<div class="worker-content" @click="() => toggleWorkerHoliday(worker.id)">
							{{ worker.shortName }}
						</div>
					</ion-col>
				</ion-row>
				<ion-row class="row__content" v-for="time in staffWorkTime.range()" :key="`hour__${time}`">
					<ion-col size="auto">
						<div class="hour">{{ time }}</div> 
					</ion-col>
					<ion-col class="ceil" v-for="worker in workers" :key="`worker_slot_${worker.id}`" size="auto"
						v-bind:class="{
							holiday: workersWithHoliday.includes(worker.id)
						}">
						<div class="ceil-content empty">
							-
						</div>
					</ion-col>
				</ion-row>
			</ion-grid>

			<div class="worker-columns-container">
				<WorkerOrdersColumn 
				v-for="worker in workers" :key="`worker-${worker.id}`"
				:worker="worker" :orders="orders" 
				:workerWorkTime="staffWorkTime"
				:cardStaticClick="openOrderDetails"
				:replaceIsDisable="!data.editMode"
				:replaceIsValid="data.replaceIsValid" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Order from '@/assets/order';
import { ComputedRef, computed, reactive, triggerRef, watch } from 'vue';
import { useStore } from 'vuex';
import User from '@/assets/user';
import { getTimeString  } from '@/assets/date';
import { IonBadge, IonButton, IonCol, IonGrid, IonItem, IonRow } from '@ionic/vue';
import OrderCard from './OrderCard.vue';
import { useRoute, useRouter } from 'vue-router';
import draggable from 'vuedraggable'
import WorkerOrdersColumn from './WorkerOrdersColumn.vue';
import TMS from '@/api/tms';
import OrderDetails from '../OrderDetails.vue'
import StaffWorkTime from '@/assets/staffWorkTime';
export default {
	name: "OrderLoadMap",
	components: {
		IonGrid,
		IonCol,
		IonRow,
		IonItem,
		IonButton,
		IonBadge,
		OrderCard,  
		draggable,
		OrderDetails,
		WorkerOrdersColumn,
	},	
	props: {
		orders: {
			type: Array<Order>,
			required: true,
		},
		staffWorkTime: {
			type: StaffWorkTime,
			default: null,
		},
		date: {
			type: Date,
			required: true,
		},
		workersWithHoliday: {
			type: Array<Number>,
			required: true,
		}
	},
	setup(props) {
		const store = useStore()
		const orders:ComputedRef<Array<Order>> = computed(() => props.orders)
		const workersWithHoliday:ComputedRef<Array<Number>> = computed(() => props.workersWithHoliday)
		const user = computed(() => store.getters.userMainInfo)
		const staffWorkTime = computed(() => props.staffWorkTime)
		const data = reactive<{
			editMode: boolean,
			replaceOrder: string|null,
			replaceIsValid: boolean,
			orderDetails: Order|null,
			orderDetailsIsOpen: boolean,
		}>({
			editMode: false,
			replaceOrder: null,
			replaceIsValid: true,
			orderDetails: null,
			orderDetailsIsOpen: false,
		})
		const workers:ComputedRef<Array<User>> = computed(() => {
			return store.getters.staffWorkers
		}) 
		const range = (start:number, end:number, step = 1) => {
			let output = [];
			if (typeof end === 'undefined') {
				end = start;
				start = 0;
			}
			for (let i:number = start; i < end; i += step) {
				output.push(i);
			}
			return output;
		};

		const ordersWithoutWorker:ComputedRef<Array<Order>> = computed(() => {
			return orders.value.filter((order:Order) => order.isNotAccepted()) 
		})
		const ordersWithWorker:ComputedRef<Array<Order>> = computed(() => {
			return orders.value.filter((order:Order) => !order.isNotAccepted()) 
		})

		const createWorkerHolidayHandler = (workerId:number) => {
			if (user.value["roleId"] != 3)  return

			TMS.user().holidayCreate(workerId, props.date).then((response) => {
				if (response.data && response.data.err) throw response.data.err
				
				workersWithHoliday.value.push(workerId)
			})
		}

		const deleteWorkerHolidayHandler = (workerId:number) => {
			if (user.value["roleId"] != 3)  return
			
			TMS.user().holidayDelete(workerId, props.date).then((response) => {
				if (response.data && response.data.err) throw response.data.err
				
				let workerIndex = workersWithHoliday.value.indexOf(workerId)
				delete workersWithHoliday.value[workerIndex]
			})
		}

		const toggleWorkerHoliday = (workerId:number) => {
			if (workersWithHoliday.value.includes(workerId)) {
				deleteWorkerHolidayHandler(workerId)
			}
			else {
				createWorkerHolidayHandler(workerId)
			}
		}
		
		const toggleEditMode = () => {
			data.editMode = !data.editMode
		}

		const log = () => {
			console.log("move")
		}

		const startDrag = (event:any) => {
			data.replaceOrder = event.item.id
			data.replaceIsValid = true
		}
		const endDrag = (event:any) => {
			data.replaceOrder = null
			if(!data.replaceIsValid) {
				event.cancel = true
				triggerRef(orders)
			}
			data.replaceIsValid = true
		}

		function checkTimeIntervalsOverlap(start1:Date, end1:Date, start2:Date, end2:Date) {
			return (start1 <= end2 && end1 >= start2) || (start1 >= start2 && end1 <= end2);
		}

		const onDragMove = (event:any) => {
			data.replaceOrder = event.from == event.to ?
				null :
				event.dragged.id
			if (data.replaceOrder) {
				let id:string = event.to.id
				let draggedOrderId:number = Number(data.replaceOrder)
				let draggedOrder:Order|undefined = ordersWithoutWorker.value.find((order:Order) => {
					return order.orderId == draggedOrderId
				})
				if (draggedOrder == undefined) return
				let workerId:number = Number(id.split("-")[1])
				let workerOrders = ordersWithWorker.value.filter((order:Order) => {
					return order.worker && order.worker.id == workerId
				})

				let overlap = workerOrders.find((order:Order) => {
					if (!draggedOrder) return false
					return checkTimeIntervalsOverlap(order.startAt, order.endAt, draggedOrder.startAt, draggedOrder.endAt )
				})

				data.replaceIsValid = !Boolean(overlap)
			}
		}

		const getWorkerOrders = (worker:User) => {
			return ordersWithWorker.value.filter((order:Order) => {
				return order.worker && order.worker.id == worker.id
			})
		}

		const openOrderDetails = (order:Order) => {
			data.orderDetails = order
			data.orderDetailsIsOpen = true
		}

		const closeOrderDetails= () => data.orderDetailsIsOpen = false

		return {
			log,
			data,
			range,
			user,
			orders,
			workers,
			staffWorkTime,
			toggleEditMode,
			getTimeString,
			ordersWithoutWorker,
			toggleWorkerHoliday,
			workersWithHoliday,
			ordersWithWorker,
			startDrag,
			endDrag,
			onDragMove,
			getWorkerOrders,
			openOrderDetails,
			closeOrderDetails,
		}
	}
}
</script>
 
<style  scoped>

@import url(../../theme/variables.css);

.order-load-map{
	height: 100%;
	padding-top: 16px;
	padding-bottom: 6px;
	
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.load-map__columns{
	width: 100%;
	height: 835px;
	overflow-x: auto;
	overflow-y: auto;
	font-size: 14px;
	position: relative; 
}

ion-grid{
	padding-bottom: 0;
	padding-bottom: 1px solid var(--ion-color-step-250);
}

.load-map__header{
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 10px 0;
	padding-bottom: 0;
}

.header__date{
	font-size: 18px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.ceil{
	border: solid 1px  var(--ion-color-step-250);
	border-right: none;
	border-bottom: none;
    text-align: center;
	height: 42px;

	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
}

.ceil.holiday {
	background: rgba(128, 121, 121, 0.1);
	color: grey;
}

.ceil:last-child{
	border: solid 1px  var(--ion-color-step-250);
	border-bottom: none;
}

.hour{
	width: 40px;
	color: var(--ion-color-step-450);
	display: flex;
	justify-content: center;
	align-items: center;
}

.worker{
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--ion-color-primary);
	height: 32px;
	font-size: 14px;
}

.worker-content{
	width: 96px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.worker:last-child{
	border: solid 1px  var(--ion-color-step-250);
}

.ceil-content{
	width: 96px;
	padding: 10px;

	height: 100%;
}

.ceil-content.empty{
	color: var(--ion-color-step-550);
}



.row__content{
	display: flex;
  	flex-wrap: nowrap;
}

.row__content.header {
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	z-index: 2;
}

ion-row:first-child > ion-col:last-child{ 
	border-bottom: none;
}

ion-row:last-child > ion-col {
	border-bottom: solid 1px  var(--ion-color-step-250);
}

ion-row:last-child > ion-col:first-child {
	border-bottom: none;
}

ion-row:last-child > ion-col:last-child {
	border: solid 1px  var(--ion-color-step-250);
}

.toolbar__orders-without-worker{
	display: flex;
	flex-direction: row;
	gap:10px
}

.load-map__toolbar{
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	gap: 10px;
}

.toolbar__buttons{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: 10px;
}

.clear-button{
	color: var(--ion-color-primary);

	display: flex;
	flex-direction: row;

	gap: 10px;
}

.clear-button__label{
	text-decoration: underline;
}

.clear-button__value{
	font-weight: 600;
}

.toolbar__orders{
	overflow-x: auto;
	width: 100%;

	white-space: nowrap;
}

.toolbar__orders > *{
	display: inline-flex;
	margin-right: 10px;
}

.worker-columns-container{
	position: absolute;
	top: 37px;
	left: 56px;
	display: flex;
	flex-direction: row;
	z-index: 1;
}
</style>