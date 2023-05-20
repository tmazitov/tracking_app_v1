<template>
	<div class="order-card-small-container">
		<div class="order-card-small">
			<div :class="`order-card-small__status ${orderStatus.colorName}`">
				{{ orderStatus.icon }}
			</div>
			<div class="order-card-small__main-info">
	
				<div class="main-info__title">
					<div class="title__name">{{ order.title }}</div>
					<span v-if="order.worker">
						<div class="title__worker" v-if="user.roleId != 1">
							{{ order.worker.shortName }}
						</div>
						<div class="title__worker" v-if="user.roleId == 1 && order.manager"> 
							{{ order.manager.shortName }}
						</div>
					</span>
					<span v-if="order.manager && !order.worker">
						<div class="title__worker"> 
							{{ order.manager.shortName }}
						</div>
					</span>
				</div>
	
				<div class="main-info__subtitle">
					<div class="plan">{{getTimeString(order.startAt)}} - {{getTimeString(order.endAt)}}</div>
					<div class="duration">{{orderTimeFact}}</div>
				</div>
	
			</div>
			<div class="order-card-small__worker" @click="toggleDetails">
				<ion-icon :icon="data.isOpen?chevronUpOutline:chevronDownOutline"></ion-icon>
			</div>
		</div>
		<transition name="details">
			<div class="order-card-small__details" v-if="data.isOpen">
				<div class="details__content-wrapper">
					<div class="details__content">
						<div class="details__workers">
							<div>Точек : 
								<ion-text color="primary">{{order.points.length}}</ion-text>
							</div>
							<div v-if="order.helpers">Грузчики :
								<ion-text color="primary">{{order.helpers}}</ion-text>
							</div>
						</div>
						<div class="details__description" v-if="order.comment">
							{{limitedString(order.comment, 60)}}
						</div>
					</div>
					<div class="details__open-more">
						<ion-button @click="() => openDetails(order)" size="small" fill="clear">Подробнее</ion-button>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import Order from '@/assets/order'
import { limitedString } from '@/assets/string'
import { computed, onMounted, reactive } from 'vue'
import { getTimeString } from '@/assets/date'
import { useStore } from 'vuex'
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons'
import { IonButton, IonIcon, IonText } from '@ionic/vue'
import { toTimeString } from '@/assets/standardDimensions'

export default {
	name: 'OrderCardSmall',

	components:{
		IonText,
		IonButton,
		IonIcon,
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
		const data = reactive<{
			isOpen: boolean,
			now: Date,
			nowInterval: NodeJS.Timer|null,
		}>({
			isOpen: false,
			now: new Date(),
			nowInterval: null,
		})

		const toggleDetails = () => data.isOpen = !data.isOpen

		const order:Order = props.order
		const orderTitle =	computed(() => order.getTitle())
		const orderTime = 	computed(() => order.getTime())
		const orderStatus = computed(() => order.getStatusMessage())

		const user = computed(() => store.getters.userMainInfo)

		onMounted(() => {
			data.nowInterval = setInterval(() => {
				data.now = new Date()
			}, 1000)
		})


		const orderTimeFact = computed(() => {
			if (!order || !order.startAtFact) return
			if (order.statusId != 5 && data.nowInterval){
				clearInterval(data.nowInterval)
			}

			
			let difference
			if (order.endAtFact){
				difference = Math.abs(order.endAtFact.getTime() - order.startAtFact.getTime()) / 1000
			} else {
				difference = Math.abs(data.now.getTime() - order.startAtFact.getTime()) / 1000
			}


			let timeString = toTimeString(difference)
			if (timeString == "") timeString = "0 мин."
			return timeString;
		})

		return {
			order,
			orderTime,
			orderTitle,
			orderStatus,
			openDetails: props.openDetails,
			limitedString,
			user,
			getTimeString,
			chevronDownOutline,
			chevronUpOutline,
			data,
			toggleDetails,
			orderTimeFact,
		}
	}
}
</script>

<style scoped>

@import url(../theme/variables.css);

.order-card-small-container{
	border-radius: 4px;
	background: var(--ion-card-background);
	color: var(--ion-color-step-800);
	font-size: 14px;
}

/*var(--ion-card-background)*/
.order-card-small{
	display: grid;
	grid-template-columns: 36px calc(100% - 12px - 36px - 12px - 32px) 32px;
	gap: 12px;
	padding: 14px;
}

.order-card-small__status{
	height: 36px;
	width: 36px;
	border-radius: 4px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 16px;
}

.order-card-small__status.primary{
	background: #FFC107;
}
.order-card-small__status.secondary{
	background: #4CAF50;
}
.order-card-small__status.tertiary{
	background: #1976D2;
}
.order-card-small__status.success{
	background: #009688 ;
}

.order-card-small__status.danger{
	background: grey;
}

.order-card-small__worker{
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--ion-color-step-600);
}

.main-info__subtitle{
	color: var(--ion-color-step-400);
	font-size: 13px;
	display: flex;
	flex-direction: row;
	gap: 10px;
}

.duration{
	color: var(--ion-color-step-550);
}
.main-info__title{
	display: flex;
	flex-direction: row;
	gap:7px;
	max-width: 100%;
	margin-bottom: 3px;
}
.title__name{
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	color: var(--ion-color-step-800);
	font-size: 16px;
}

.title__worker{
	color: var(--ion-color-step-550);
	white-space: nowrap;
}

.order-card-small__details{
	max-height: 200px;
	border-top: 1px solid var(--ion-color-step-300);
	background: var(--ion-card-background);
}

.details__content-wrapper{
	display: grid;
	grid-template-rows: auto 33.3px; 
	padding: 14px;
	height: 100%;
	color: var(--ion-color-step-600);
}
.details__content{
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.details-enter-active{
	animation: details .3s ease-in-out;
	overflow: hidden;
}
.details-leave-active{
	animation: details .3s ease-in-out reverse;
	overflow: hidden;
}

@keyframes details {
	from{
		max-height: 0;
		opacity: 0.5;
	}
	to{
		max-height: 200px;
		opacity: 1;
	}	
}

.details__workers{
	display: flex;
	flex-direction: row;
	gap: 16px;
	height: fit-content;
	font-size: 16px;

}


.details__open-more{
	display: flex;
	justify-content: end;
}

.details__description{
	max-height: 48px;
	width: 100%;
	
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>