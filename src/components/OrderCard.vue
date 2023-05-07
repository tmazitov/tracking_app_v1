<template>
	<div class="order__card">
		<ion-card>
			<ion-card-header>
				<ion-card-subtitle>
					<ion-chip :color="orderStatus.colorName">{{orderStatus.message}}</ion-chip>
					<ion-chip v-if="order.isRegularCustomer" color="success">Постоянный клиент</ion-chip>
				</ion-card-subtitle> 	
				<ion-card-title>
					<div class="order-title">{{orderTitle}}</div>
					<div class="time">{{orderTime}}</div>
				</ion-card-title>
			  </ion-card-header>
			  <ion-card-content class="content__container">
				<div class="property__container secondary">
					<ion-text class="property-container__worker" v-if="order.worker">
						{{order.worker.shortName}}
					</ion-text>
					<ion-text>
						Точек:
						<ion-text color="primary">{{order.points.length}}</ion-text>
					</ion-text>
					<ion-text v-if="order.helpers">
						Грузчики:
						<ion-text color="primary">{{order.helpers ?? 0}}</ion-text> 
					</ion-text>
				</div>
				<div>{{order.comment}}</div>
				<div>
					<ion-button @click="() => openDetails(order)" fill="clear">Подробнее</ion-button>
				</div>
			  </ion-card-content>
		</ion-card>
	</div>
</template>

<script lang="ts">
import Order from '@/assets/order';
import { IonCard, IonChip, IonText, IonCardHeader, IonButton, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';

export default {
	name: 'OrderCard',
	components: {
		IonText,
		IonCard,
		IonChip,
		IonButton,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent
	},
	props: {
		order: {
			type: Order,
			required: true,
		},
		openDetails: {
			type: Function,
			required: true,
		}
	},
	setup(props, ctx) {
		const order:Order = props.order
		const orderTitle = order.getTitle()
		const orderTime = order.getTime()
		const orderStatus = order.getStatusMessage()
		return {
			order,
			orderTime,
			orderTitle,
			orderStatus,
			openDetails: props.openDetails,
		}
	},
}
</script>

<style scoped>
ion-card{
	margin: 0;
}
.content__container{
	display: flex;
	flex-direction: column;
	gap:5px;
}
.property__container.secondary{
	display: flex;
	flex-direction: row;
	gap: 16px;
}

ion-card-title{
	display: flex;
	flex-direction: row;
	gap: 16px;
	font-size: 18px;
}

.property-container__worker{
	color: var(--ion-color-step-650);
}

.time{
	color: grey;
	width: 110px;
	text-align: end;
}

.order-title{
	width: calc(100% - 16px - 110px);
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>