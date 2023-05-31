<template>
	<div class="select-worker">
		<ion-modal ref="modal" trigger="submit" :is-open="data.isOpen">
			<ion-header>
				<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="() => closeHandler()">
						<ion-icon :icon="closeOutline"></ion-icon>
					</ion-button>
				</ion-buttons>
				<ion-title class="title">
					Назначить водителя
				</ion-title>
				<ion-buttons slot="end">
					<ion-button :disabled="data.selectedWorkerId == -1" :strong="true" @click="submitHandler">
						<ion-icon :icon="checkmarkOutline"></ion-icon>
					</ion-button>
				</ion-buttons>
				</ion-toolbar>
			</ion-header>
			<ion-content>

				<div class="order-context">
					<div class="order-context__time">{{currentOrder.getTime()}}</div>
					<div class="order-context__label">
						{{ currentOrder.title}}
					</div>
				</div>

				<div class="worker-list">
					<div class="worker" v-for="worker in workers" :key="`worker-${worker.user.id}`">
						<ion-item>
							<div class="worker-icon" @click="selectHandler(worker.user)">
								<ion-icon :icon="workerIcon(worker.user)" color="primary" slot="start"></ion-icon>
							</div>

							<ion-label @click="selectHandler(worker.user)">{{worker.user.shortName}}</ion-label>
							
							<div class="worker-busy" v-if="worker.busyOrder">Занят</div>

							<div @click="openDetails(worker.user)">
								<ion-icon v-if="worker.user.state.detailsIsOpen" :icon="chevronUpOutline"></ion-icon>
								<ion-icon v-else :icon="chevronDownOutline"></ion-icon>
							</div>
						</ion-item>
						<transition name="details">
							<div class="worker-details" v-if="worker.user.state.detailsIsOpen">
								<div class="worker-details__content">
									<div class="worker-details__order-list" v-if="worker.orders.length > 0">
										<ion-item class="worker-details__order"  
										v-for="order in worker.orders" 
										:key="`order_${order.orderId}`"
										v-bind:class="{
											busy: worker.busyOrder && worker.busyOrder.orderId == order.orderId 
										}">
											<div class="worker-details__order-time">{{order.getTime()}}</div>
											<ion-label>{{ order.title }}</ion-label>
										</ion-item>
									</div>
									<div class="worker-details__empty" v-else>
										Нет назначенных заказов
									</div>
								</div>
							</div>
						</transition>
					</div>
				</div>

			</ion-content>
		</ion-modal>
	</div>
</template>

<script lang="ts">
import TMS from '@/api/tms';
import Order from '@/assets/order';
import User from '@/assets/user';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonIcon, IonLabel } from '@ionic/vue';
import { AxiosResponse } from 'axios';
import { closeOutline, checkmarkOutline, radioButtonOffOutline, radioButtonOnOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { ComputedRef, computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';

interface SelectableWorker {
	user: User
	orders: Array<Order>
	busyOrder: Order|undefined
}

export default {
	name: "SelectWorkerModal",
	components: {
		IonModal,
		IonLabel,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonButton,
		IonTitle,
		IonContent,
		IonItem,
		IonIcon,
	},
	props: {
		selectedWorkerId: {
			type: Number,
			default: -1,
		},
		isOpen: {
			type: Boolean,
			required: true,
		},
		closer: {
			type: Function,
			required: true,
		},
		order: {
			type: Order,
			required: true,
		},
	},
	setup(props) {

		const data = reactive({
			selectedWorkerId: props.selectedWorkerId,
			isOpen: props.isOpen,
		})



		const selectHandler = (worker:User) => {
			data.selectedWorkerId = data.selectedWorkerId != worker.id ? 
				worker.id:
				-1
		}

		const workerIcon = (worker:User) => {
			return worker.id==data.selectedWorkerId?radioButtonOnOutline:radioButtonOffOutline
		}

		const workerOrders = (worker:User):Array<Order> => {
			return store.getters.orderListByWorker(worker)
		}
		
		const openDetails = (worker:User) => {
			worker.state.detailsIsOpen = !worker.state.detailsIsOpen
		}

		watch(() => props.isOpen, (newValue) => {
			data.isOpen = newValue
		})

		const store = useStore()
		const BUSY_ORDER_DIFFERENCE = 15 * 60 * 1000 // 15 min in ms
		const currentOrder = props.order


		const checkDateIntersection = (startDate1:Date, endDate1:Date, startDate2:Date, endDate2:Date) => {
			return (startDate1 <= endDate2 && startDate2 <= endDate1);
		}
		
		const workers:ComputedRef<Array<SelectableWorker>> = computed(() => {
			let workers:Array<User> = store.getters.staffWorkers

			return workers.map((worker:User) => {
				let orders:Array<Order> = store.getters.orderListByWorker(worker)
					.sort((ord1:Order,ord2:Order) => {
						return ord1.startAt.getTime() - ord2.startAt.getTime()
					})
				let busyOrder:Order|undefined = orders.find((order:Order) => {
					return checkDateIntersection(currentOrder.startAt, currentOrder.endAt, order.startAt, order.endAt)
				})
				return {
					user: worker,
					orders,
					busyOrder,
				}
			}) 
		})

		const closeHandler = props.closer

		const submitHandler = () => {
			TMS.order().setWorker(props.order.orderId, data.selectedWorkerId)
			.then((response:AxiosResponse) => {
				if (response.data["err"]) {
					throw response.data["err"]
				}	
				let selectedWorker = new User(response.data)
				currentOrder.worker = selectedWorker
				currentOrder.statusId = 4
			})

			
			closeHandler()
			workers.value.forEach((worker:SelectableWorker) => worker.user.state.detailsIsOpen = false)				
		}
		
		return {
			data,
			workers,
			workerOrders,
			workerIcon,
			openDetails,
			closeHandler,
			selectHandler,
			submitHandler,
			closeOutline,
			checkmarkOutline,
			currentOrder,

			chevronUpOutline,
			chevronDownOutline,
		}
	},
}
</script>

<style scoped>

@import url(../../theme/variables.css);

.title{
	text-align: center;
}

.worker-list{
	display: flex;
	flex-direction: column;
	gap: 16px;

	padding: 16px;
}

.worker-icon{
	width: 32px;
}

.worker-busy{
	margin: 0 10px;
	color: var(--ion-color-danger);
}
.worker-details{
	background: var(--ion-item-background);
	border-top: 1px solid var(--ion-color-step-200);
	
	overflow-y: auto;
	
	max-height: 192px;
	height: fit-content;
}

.details-enter-active{
	overflow:hidden;
	animation: details .4s;
}	
.details-leave-active{
	overflow:hidden;
	animation: details .4s reverse;
}

@keyframes details {
	from {
		max-height: 0;
	}	
	to {
		max-height: 192px;
	}
}

.worker-details__order.busy{
	color: var(--ion-color-danger);
}
.worker-details__order-time{
	margin-right: 16px;
	width: 100px;
}

.worker-details__empty{
	padding: 16px;
	text-align: center;
	color: var(--ion-color-step-450);
}

.order-context{
	padding: 16px;
	padding-bottom: 0;
	display: grid;
	grid-template-columns: 100px calc(100% - 100px - 10px);
	column-gap: 10px;
	color: var(--ion-color-step-500);
}

.order-context__time{
	white-space: nowrap;
	width: 100px;
}

.order-context__label{
	width: 100%;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>