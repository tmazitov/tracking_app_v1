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
				</ion-card-title>
				<div class="property__container margin">
					<div class="time">{{orderTime}}</div>
					<div class="property__container" v-if="user.roleId == 1">
						<ion-text v-if="order.manager"> | </ion-text>
						<ion-text class="property-container__worker" v-if="order.manager">
							{{order.manager.shortName}}
						</ion-text>
					</div>
					<div class="property__container" v-else>
						<ion-text v-if="order.worker"> | </ion-text>
						<ion-text class="property-container__worker" v-if="order.worker">
							{{order.worker.shortName}}
						</ion-text>
					</div>
				</div>
			  </ion-card-header>
			  <ion-card-content class="content__container">
				<div class="property__container">
					<ion-text>
						Точек:
						<ion-text color="primary">{{order.points.length}}</ion-text>
					</ion-text>
					<ion-text v-if="order.helpers">
						Грузчики:
						<ion-text color="primary">{{order.helpers ?? 0}}</ion-text> 
					</ion-text>
				</div>
				<div v-if="order.comment">{{limitedString(order.comment, 120)}}</div>
				<div>
					<ion-button @click="() => openDetails(order)" fill="clear">Подробнее</ion-button>
				</div>
			  </ion-card-content>
		</ion-card>
	</div>
</template>

<script lang="ts">
import Order from '@/assets/order';
import { limitedString } from '@/assets/string';
import { IonCard, IonChip, IonText, IonCardHeader, IonButton, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

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
		const store = useStore()

		const order:Order = props.order
		const orderTitle =	computed(() => order.getTitle())
		const orderTime = 	computed(() => order.getTime())
		const orderStatus = computed(() => order.getStatusMessage())

		const user = computed(() => store.getters.userMainInfo)

		return {
			order,
			orderTime,
			orderTitle,
			orderStatus,
			openDetails: props.openDetails,
			limitedString,
			user,
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
.property__container{
	display: flex;
	flex-direction: row;
	gap: 16px;
}

.property__container.margin{
	margin-top: 5px;
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
	font-size: 16px;
}


.order-title{
	width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>