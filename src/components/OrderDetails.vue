<template>
	<transition name="modal">
		<div class="order-details" v-if="isOpen">
			<div class="order-details__chips">
				<ion-chip :color="status?.colorName">{{status?.message}}</ion-chip>
				<ion-chip v-if="order?.isRegularCustomer" color="success">Постоянный клиент</ion-chip>
			</div>
			<div class="order-details__title-container">
				<div class="title-container__arrow" @click="() => close()">
					<ion-icon :icon="arrowBackOutline"></ion-icon>
				</div>
				<div class="title-container__title">
					{{order?.title}}
				</div>
			</div>
			<div class="order-details__date">
				{{ getTimeString(order?.startAt)}} {{getDateString(order?.startAt)}} 
			</div>
			<div class="order-details__description" v-if="order?.comment">
				{{ order?.comment }}
			</div>
			<div v-if="order?.helpers">Количество грузчиков: {{order?.helpers}}</div>
			<div class="order-details__peoples" v-if="order?.owner && user.id != order?.owner.id">
				<div class="label">Заказчик</div> 
				<div class="value">{{order?.owner.shortName}}</div>
			</div>
			<div class="order-details__peoples" v-if="order?.worker && user.id != order?.worker.id">
				<div class="label">Водитель</div>
				<div class="value">{{order?.worker.shortName}}</div>
			</div>
			<div class="order-details__peoples" v-if="order?.manager && user.id != order?.manager.id">
				<div class="label">Оператор</div>
				<div class="value">{{order?.manager.shortName}}</div>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import { getDateString, getTimeString } from '@/assets/date';
import Order from '@/assets/order';
import { IonBackdrop, IonChip, IonIcon, IonTitle } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { ComputedRef, Transition, computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';

interface StatusMessage {
	message:string
	colorName:string
}

export default {
	name: "OrderDetails",
	components: {
		IonBackdrop,
		IonTitle,
		IonIcon,
		IonChip,
		Transition
	},
	props:{ 
		order: {
			type: Order,
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
		const data = reactive({})

		const orderData:ComputedRef<Order|undefined> = computed(() => {
			if (!props.order) return
			return props.order
		})
		const status:ComputedRef<StatusMessage|undefined> = computed(() => {
			let order:Order|undefined = orderData.value
			if (!order) return

			return order.getStatusMessage()
		})
		const isOpen = computed(() => props.isOpen)
		const user = computed(() => store.getters.userMainInfo)

		return {
			data,
			status,
			user,
			order: orderData,
			isOpen: isOpen,
			getDateString,
			getTimeString,
			close: props.closer,
			arrowBackOutline,
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
	background: var(--ion-color-step-100);
	padding: 16px;
	color: white;
	position: absolute;
	top: 0;
	z-index: 14;
	width: 100%;

	display: flex;
	flex-direction: column;
	gap: 16px;
}

@media (max-width:768px) {
	.order-details{
		height: 100%;
	}
}

.modal-enter-active{
	animation: .5s modal cubic-bezier(0.76, 0.03, 0.54, 0.96);
}
.modal-leave-active{
	animation: .5s modal reverse cubic-bezier(0.76, 0.03, 0.54, 0.96);
}

@keyframes modal {
	from {
		left: 100vw;
	}
	to {
		left: 0;
	}
}

.order-details__title-container{
	display: grid;
	grid-template-columns: 20px calc(100% - 20px - 16px - 20px - 16px) 20px;
	grid-column-gap: 16px;
}

.order-details__title-container > * {
	display: flex;
	align-items: center;
}

.title-container__title{
	font-size: 22px;
}

.order-details__description {
	border: 1px solid var(--ion-color-step-300);
	padding: 10px;
	border-radius: 4px;	
	max-height: 250px;
	overflow-y: auto;
}


ion-icon{
	height: 20px;
	width: 20px;
}

.order-details__peoples{
	display: grid;
	grid-template-columns: 120px calc(100% - 120px - 16px);
	grid-column-gap: 16px;
}
</style>