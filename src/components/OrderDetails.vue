<template>
	<transition name="modal">
		<div class="order-details" v-if="isOpen" v-bind:class="{
			'include-button': Boolean(submit),
		}">
			<div class="order-details__header">
				<div class="order-details__chips">
					<ion-chip :color="status?.colorName">{{status?.message}}</ion-chip>
					<ion-chip v-if="order?.isRegularCustomer" color="success">Постоянный клиент</ion-chip>
				</div>
				<div class="order-details__title-container">
					<div class="title-container__arrow" @click="() => close()">
						<ion-icon :icon="arrowBackOutline"></ion-icon>
					</div>
					<div class="title-container__title" v-if="order">
						{{ order.title }}
					</div>
				</div>
			</div>


			<div class="order-details__content">
				<div class="order-details__peoples">
					<div class="label">Дата и время:</div> 
					<div class="value">
						{{getDateString(order?.startAt)}}
						{{getTimeString(order?.startAt)}} 
						-
						{{getTimeString(order?.endAt)}}
					</div>
				</div>

				<div class="order-details__peoples" v-if="order?.owner && user.id != order?.owner.id && order?.owner.id != order?.manager?.id">
					<div class="label">Заказчик:</div> 
					<div class="value">{{order?.owner.shortName}}</div>
				</div>
				<div class="order-details__peoples" v-if="order?.worker && user.id != order?.worker.id">
					<div class="label">Водитель:</div>
					<div class="value">{{order?.worker.shortName}}</div>
				</div>
				<div class="order-details__peoples" v-if="order?.manager && user.id != order?.manager.id">
					<div class="label">Оператор:</div>
					<div class="value">{{order?.manager.shortName}}</div>
				</div>

				<div class="order-details__properties">
					<div class="order-details__map" v-if="order">
						<OrderPointsMap
							:points="order.points"
							readonly
						/>
					</div>
				</div>

				<div class="order-details__properties description"
				v-if="order?.bill.helperCount || 
						order?.bill.isFragileCargo ||
						order?.comment
						">
					<div class="title">Описание</div>
					<div v-if="order?.bill.helperCount">
						Грузчики: {{order?.bill.helperCount}} чел. x {{order.bill.helperHours}} ч.
					</div>
					<div v-if="order?.bill.isFragileCargo">
						Необходима упаковка защитной плёнкой
					</div>
					<div class="order-details__description" v-if="order?.comment">
						{{ order?.comment }}
					</div>
				</div>

				<div class="order-details__action">
					<div class="order-details__time-fact" v-if="order?.statusId == 1 || order?.statusId == 5">
						<div class="time-fact__timer">
							<div class="time-fact__title" v-if="order?.statusId == 1">
								Заказ выполнен за 
							</div>
							<div class="time-fact__icon" v-if="order?.statusId == 5">
								<ion-icon :icon="timeOutline"></ion-icon>
							</div>
							<div class="time-fact__time">
								{{ orderTimeFact }}
							</div>
						</div>
					</div>
					<div class="order-details__action-button" v-if="submit && isOpen">
						<ion-button id="submit" class="submit" @click="submit.action">
							{{ submit.title }}
						</ion-button>
						<SelectWorkerModal
							v-if="submit.id==3 && order"
							:isOpen="data.selectWorkerIsOpen"
							:selector="chooseWorker"
							:closer="closeChooseWorker"
							:order="order"
						/>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import { getDateString, getTimeString } from '@/assets/date';
import Order from '@/assets/order';
import { limitedString } from '@/assets/string';
import { IonButton, IonChip, IonIcon } from '@ionic/vue';
import { arrowBackOutline, timeOutline } from 'ionicons/icons';
import { ComputedRef, Transition, computed, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import OrderPointsMap from '@/components/map/OrderPointsMap.vue';
import SelectWorkerModal from './modal/SelectWorkerModal.vue';
import TMS from '@/api/tms';
import { toTimeString } from '@/assets/standardDimensions';

interface StatusMessage {
	message:string
	colorName:string
}

// todo : refactor to ion-modal

export default {
	name: "OrderDetails",
	components: {
		IonButton,
		IonIcon,
		IonChip,
		Transition,
		OrderPointsMap,
		SelectWorkerModal
	},
	props:{ 
		order: {
			type: Order,
			default: null,
			required: false,
		},
		isOpen: {
			type: Boolean,
			required: true,
		},
		closer: {
			type: Function,
			required: true,
		}
	},
	setup(props){
		const store = useStore()
		const data = reactive<{
			now: Date,
			nowInterval: NodeJS.Timer|null,
			selectWorkerIsOpen: boolean
		}>({
			now: new Date(),
			nowInterval: null,
			selectWorkerIsOpen: false,
		})

		const orderData:ComputedRef<Order|undefined> = computed(() => {
			if (!props.order) return
			return props.order
		})
		const status:ComputedRef<StatusMessage|undefined> = computed(() => {
			let order:Order|undefined = orderData.value
			if (!order) return

			return order.getStatusMessage()
		})

		onMounted(() => {
			data.nowInterval = setInterval(() => {
				data.now = new Date()
			}, 1000)
		})

		const isOpen = computed(() => props.isOpen)
		const closeChooseWorker = () => data.selectWorkerIsOpen = false
		const chooseWorker = (workerId:number) => {
			if (!props.order) return
			TMS.order().setWorker(props.order.orderId, workerId)
		}
		const orderTimeFact = computed(() => {
			if (!orderData.value || !orderData.value.startAtFact) return
			if (orderData.value.statusId != 5 && data.nowInterval){
				clearInterval(data.nowInterval)
			}

			
			let difference
			if (orderData.value.endAtFact){
				difference = Math.abs(orderData.value.endAtFact.getTime() - orderData.value.startAtFact.getTime()) / 1000
			} else {
				difference = Math.abs(data.now.getTime() - orderData.value.startAtFact.getTime()) / 1000
			}


			let timeString = toTimeString(difference)
			if (timeString == "") timeString = "0 м."
			return timeString;
		})
		
		const openChooseWorker = () => data.selectWorkerIsOpen = true
		
		const user = computed(() => store.getters.userMainInfo)
		const submit = computed(() => {
			if (!props.order) return

			let handler = props.order.getDetailAction(user.value)
			if (!handler) return 
			
			switch (handler.id){ 
				case 3:
					handler.action = openChooseWorker
			}
			return handler
		})

		return {
			data,
			status,
			user,
			orderTimeFact,
			order: orderData,
			isOpen: isOpen,
			getDateString,
			getTimeString,
			close: props.closer,
			arrowBackOutline,
			limitedString,
			timeOutline,
			submit,

			closeChooseWorker,
			chooseWorker,
			openChooseWorker,
		}
	}
}
</script>

<style scoped>
@import url(../theme/variables.css);
.order-details-container{
	width: 100%;
	height: 100%;
}
.order-details{
	position: fixed;
	top: 0;
	z-index: 14;

	width: 100%;

	background: white;
	color: black;
	gap: 16px;
	overflow-y: auto;
}

.order-details__header{
	position: sticky;
	top: 0;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background: white;
	z-index: 1001;
	padding: 10px 16px;
}

.order-details__content{
	display: flex;
	flex-direction: column;
	padding: 16px;
	gap: 16px;
	margin-bottom: 52px;
}

.order-details__title-container{
	display: flex;
	flex-direction: row;
	gap: 16px;
	width: 100%;
}



.order-details.include-button{
	padding-bottom: 60px;
}

@media (max-width:768px) {
	.order-details{
		height: 100%;
	}
}

.modal-enter-active{
	animation: .65s modal cubic-bezier(0.76, 0.03, 0.54, 0.96);
}
.modal-leave-active{
	animation: .65s modal reverse cubic-bezier(0.76, 0.03, 0.54, 0.96);
}

@keyframes modal {
	from {
		top: 100vh;
	}
	to {
		top: 0;
	}
}



.title-container__title{
	font-size: 22px;
	max-width: calc(100% - 20px);
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.order-details__description {
	border: 1px solid var(--ion-color-step-300);
	padding: 10px;
	border-radius: 4px;	
	height: 70px;
	overflow-y: auto;
}


ion-icon{
	height: 20px;
	width: 20px;
}

.order-details__peoples{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.order-details__properties{
	/* overflow: auto; */
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.order-details__properties.description {
	border: 1px solid var(--ion-color-step-300);
	border-radius: 4px;
	padding: 16px;
}

.order-details__properties.description > .title{
	font-size: 20px;
}

.order-details__action{
	position: fixed;
	bottom: 10px;
	left: 10px;
	right: 10px;
	z-index: 1;
}

.order-details__time-fact{
	font-size: 18px;
	
	margin-bottom: 10px;
	border: 1px solid var(--ion-color-primary);
	border-radius: 4px;
	overflow: hidden;
}

.time-fact__timer{
	display: flex;
	gap: 10px;
	justify-content: center;
	align-items: center;
	height: 36px;
	background: white;
	overflow: hidden;
}

@media (prefers-color-scheme: dark) {
	.order-details{
		background: var(--ion-background-color);
		color: white;
	}

	.order-details__header{
		background: var(--ion-background-color);
	}

	.time-fact__timer{
		background: var(--ion-background-color);
	}
}

ion-button.submit{
	width: 100%;
}
</style>