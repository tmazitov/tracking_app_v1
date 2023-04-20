<template>
	<div class="order__card">
		<ion-card>
			<ion-card-header>
				<ion-card-subtitle>
					<ion-chip :color="orderStatus.colorName">{{orderStatus.message}}</ion-chip>
				</ion-card-subtitle> 	
				<ion-card-title>
					<div>{{orderTitle}}</div>
					<div class="time">{{orderTime}}</div>
				</ion-card-title>
			  </ion-card-header>
			  <ion-card-content class="content__container">
				<div class="property__container secondary">
					<ion-text>
						Точек:
						<ion-text color="primary">{{order.points.length}}</ion-text>
					</ion-text>
					<ion-text>
						Грузчики:
						<ion-text color="primary">{{order.helpers ?? 0}}</ion-text> 
					</ion-text>
				</div>
				<div>{{order.comment}}</div>
				<div>
					<ion-button fill="clear">Подробнее</ion-button>
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
	gap: 10px;
}

.time{
	color: grey;
}
</style>