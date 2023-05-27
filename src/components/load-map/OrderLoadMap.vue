<template>
	<div class="order-load-map">
		<div class="load-map__header">
			<div class="header__date">
				{{ getDateString(date) }}
			</div>
			<div class="header__workers">
				<ion-grid>
				<ion-row>
					<ion-col size="auto">
						<div class="hour"></div> 
					</ion-col>
					<ion-col class="ceil worker" v-for="worker in workers" :key="`worker_${worker.id}`" size="auto">
						<div class="worker-content">
							{{ worker.shortName }}
						</div>
					</ion-col>
				</ion-row>
			</ion-grid>
			</div>
		</div>
		<div class="load-map__columns">
			<ion-grid>
				<ion-row v-for="hour in range(5,24)" :key="`hour__${hour}`">
					<ion-col size="auto">
						<div class="hour">{{ `${hour}:00` }}</div> 
					</ion-col>
					<ion-col class="ceil" v-for="worker in workers" :key="`worker_slot_${worker.id}`" size="auto">
						<div class="ceil-content empty">
							-
						</div>
					</ion-col>
				</ion-row>

			</ion-grid>
			<div :class="`order ${order.getStatusMessage().colorName}`" v-for="order in orders" :key="`order_${order.orderId}`"
			v-bind:style="{
				...orderPosition(order),
			}">
				{{ order.getStatusMessage().icon }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Order from '@/assets/order';
import { ComputedRef, computed } from 'vue';
import { useStore } from 'vuex';
import User from '@/assets/user';
import { getDateString } from '@/assets/date';
import { IonCol, IonGrid, IonRow } from '@ionic/vue';

export default {
	name: "OrderLoadMap",
	components: {
		IonGrid,
		IonCol,
		IonRow,
	},	
	props: {
		day: {
			type: Date,
			required: true,
		}
	},
	setup(props) {

		const store = useStore()
		const date:ComputedRef<Date> = computed(() => props.day)
		const orders:ComputedRef<Array<Order>> = computed(() => {
			return store.getters.orderListByDate(props.day)
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
		const orderPosition = (order:Order) => {

			if (!order.worker){
				return {
					top: 0,
					left: 0,
					display: 'none',
				}
			}

			let left:number = workers.value.findIndex((worker:User) => {
				if (!order.worker) return false
				return order.worker.id == worker.id	
			}) * 97 + 77
			let top:number = (order.startAt.getHours() + order.startAt.getMinutes() / 60 - 4) * 40 - 6
			let bot:number = (order.endAt.getHours() + order.endAt.getMinutes() / 60 - 4) * 40 - 2
			let height:number = bot - top

			return {
				top: `${top}px`,
				left: `${left}px`,
				height: `${height}px`
			}
		}
		return {
			date,
			range,
			orders,
			workers,
			getDateString,
			orderPosition,
		}
	}
}
</script>
 
<style  scoped>

@import url(../../theme/variables.css);

.order-load-map{
	height: calc(100vh - 113px);
	overflow: hidden;
}

.load-map__columns{
	padding-bottom: 50px;	
	height: calc(100% - 78px);
	padding: 10px;
	overflow: auto;
	font-size: 14px;
	position: relative;
	margin-bottom: 56px;
}

ion-grid{
	padding-bottom: 0;
	padding-bottom: 1px solid var(--ion-color-step-250);
}

.load-map__header{
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 10px;
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

.ceil:last-child{
	border: solid 1px  var(--ion-color-step-250);
	border-bottom: none;
}

.hour{
	width: 51px;
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

.order{
	position: absolute;
	width: 96px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.order.primary{
	background: #FFC107;
}
.order.secondary{
	background: #4CAF50;
}
.order.tertiary{
	background: #1976D2;
}
.order.success{
	background: #009688 ;
}

.order.danger{
	background: grey;
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
</style>