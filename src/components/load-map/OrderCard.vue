<template>
	<div class="order-card" 
	ref="orderCard"
	v-bind:style="{
		...orderStyles(order, isValid),
		...position,
	}">
		<div class="order__status-message" v-if="order.worker" v-bind:style="{
			color: orderStyles(order, isValid)['border-color']
		}">
			{{ order.getStatusMessage().message }}
		</div>
		<div class="order__time">
			{{ getTimeString(order.startAt) }} - {{ getTimeString(order.endAt) }}
		</div>
		<div class="order__title">
			{{ order.title }}
		</div>
	</div>
</template>

<script lang="ts">
import Order from '@/assets/order';
import { ComputedRef, computed, onMounted, reactive, ref, toRaw, toRef, watch } from 'vue';
import { orderStyles, orderPosition } from './order-position';
import { getTimeString } from '@/assets/date';
import User from '@/assets/user';
import { useStore } from 'vuex';

export default {
	name: "OrderCard",
	props: {
		order: {
			type: Order,
			required:true,
		},
		smallSize: {
			type: Boolean,
			default:false,
		},
		valid: {
			type: Boolean,
			default:true,
		}
	},
	setup(props){
		const isValid = computed(() => props.valid)
		const order = computed(() => props.order)
		const smallSize = computed(() => props.smallSize)
		const position = computed(() => {
			let data = orderPosition(order.value)
			if (smallSize.value == true) {
				data.height = "48px"
				data.position = "static"
			}
			return data
		})

		const orderCard = ref<HTMLElement|null>(null)


		return {
			order, 
			isValid,
			orderCard,
			orderStyles,
			orderPosition,
			getTimeString,
			smallSize,
			position,
		}
	}
}
</script>

<style scoped>
.order-card{
	padding: 5px;
	width: 96px;
	display: flex;
	flex-direction: column;
	gap: 5px;
	border: 1px solid white;
	border-radius: 4px;
	background: var(--ion-card-background);

	font-size: 14px;
	animation: fade .25s;
}

@keyframes fade {
	from { opacity: 0;}
	to { opacity: 1;}
}

.order__title{
	height: 16px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	user-select: none;
}

.order__time{
	font-size: 12px;
	color: var(--ion-color-step-600);
	user-select: none;

}

.order__status-message{
	font-size: 12px;
	user-select: none;

}
</style>