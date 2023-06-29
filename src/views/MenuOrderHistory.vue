<template>

	<ion-page>
		<transition name="filter">
			<ion-header v-if="data.filtersIsVisible">
				<ion-card>
					<ion-toolbar >
						<div class="toolbar">
							<div class="searchbar">
								<ion-searchbar
								placeholder="Поиск" mode="ios" @ionInput="onSearchHandler"></ion-searchbar>
							</div>
							<div class="calendar-button" @click="toggleDatepicker">
								<div v-if="!data.datePickerIsOpen"><img src="/calendar-outline.svg" height="24"></div>
								<div v-if="data.datePickerIsOpen"><img src="/close-blue-outline.svg" height="24"></div>
							</div>
							<div class="calendar-button" @click="toggleMoreFilters">
								<div v-if="!data.moreFiltersIsOpen"><img src="/options-outline.svg" height="24"></div>
								<div v-if="data.moreFiltersIsOpen"><img src="/close-blue-outline.svg" height="24"></div>
							</div>
						</div>
					</ion-toolbar>
				</ion-card>
			</ion-header>
		</transition>
		<ion-content  :fullscreen="true">

			<OrderDetails
				:order="data.orderDetails"
				:isOpen="data.orderDetailsIsOpen"
				:closer="closeOrderDetails"
			/>	

			<div class="filters-container">
				<OrderListFilters :filters="orderFilters" :isOpen="data.moreFiltersIsOpen"/>
			</div>

			<transition name="datetime">
				<div class="datetime-container" v-if="data.datePickerIsOpen" >
					<ion-datetime presentation="date" 
						:value="dateFormatString" 
						@ionChange="selectDate"
						:first-day-of-week="1"
						locale="ru">
					</ion-datetime>
				</div>
			</transition>
			
			<ion-list v-if="data.ordersDates.length > 0">
				<ion-card v-for="date in data.ordersDates" :key="`order-date-${date.toLocaleDateString()}`">
					<ion-card-header>
						<ion-card-title>
							{{ checkDate(date) == -1? getDateString(date) : `${checkDate(date)} ${getDateString(date)}` }}
						</ion-card-title>
					</ion-card-header>
					<ion-list>
						<OrderCardSmall 
						v-for="order in getDateOrders(date)" :key="`order-${order.orderId}`"
						:order="order" :openDetails="openOrderDetails"/>
					</ion-list>
				</ion-card>
			</ion-list>
			<div v-else class="empty">
				Заказы не найдены
			</div>
			<ion-infinite-scroll v-if="data.ordersDates.length > 0 && data.lastPageHasData" 
			@ionInfinite="infinityScrollHandler">
				<ion-infinite-scroll-content
					loading-text="Пожалуйста подождите..."
					loading-spinner="bubbles"
				
				></ion-infinite-scroll-content>
			</ion-infinite-scroll>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import TMS from '@/api/tms';
import { checkDate, getDateString, isEqual, yyyymmdd } from '@/assets/date';
import Order from '@/assets/order';
import { newOrderListFilters } from '@/assets/orderListFilters';
import { IonPage, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSearchbar, IonHeader, IonToolbar, IonDatetime } from '@ionic/vue';
import { ComputedRef, computed, reactive, watch } from 'vue';
import OrderCardSmall from '@/components/OrderCardSmall.vue';
import OrderDetails from '@/components/OrderDetails.vue';
import { calendarOutline, optionsOutline, remove } from 'ionicons/icons';
import OrderListFilters from '@/components/OrderListFilters.vue';
import { useStore } from 'vuex';

function getUniqueDates(dates:Array<Date>) {
	const uniqueDates:Array<Date> = [];

	for (const date of dates) {
			const day = date.getDate();
			const month = date.getMonth();
			const year = date.getFullYear();

			const uniqueDate = new Date(year, month, day);

			if (!uniqueDates.some(d => d.getTime() === uniqueDate.getTime())) {
				uniqueDates.push(uniqueDate);
			}
	}

  	return uniqueDates;
}

export default {
	name: "MenuOrderHistory",
	components: {
		IonPage,
		IonDatetime,
		IonSearchbar,
		IonContent,
		IonHeader,
		IonToolbar,
		IonItem,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent,
		IonList,
		IonLabel,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
		OrderCardSmall,
		OrderDetails,
		OrderListFilters,
	},
	setup(props, ctx) {
		let store = useStore()
		let data = reactive<{
			orders: Array<Order>
			ordersDates: Array<Date>
			orderDetails: Order|undefined,
			orderDetailsIsOpen: boolean,
			filtersIsVisible: boolean,
			moreFiltersIsOpen: boolean,
			datePickerIsOpen: boolean,
			lastPageHasData: boolean,
		}>({
			orders: [],
			ordersDates: [],
			orderDetails: undefined,
			orderDetailsIsOpen: false,
			filtersIsVisible: true,
			moreFiltersIsOpen: false,
			datePickerIsOpen: false,
			lastPageHasData: true,
		})

		let orderFilters = newOrderListFilters({nonDate:true})
		let updateOrders = (isAddToList:boolean=true) => {
			return TMS.order().list(orderFilters).then((response) => {
				if (!response.data) return
				if (response.data.err) throw response.data.err

				let orders:Array<Order> = []
				let ordersData:Array<any> = response.data
				if (ordersData.length == 0){
					if (!isAddToList) {
						data.orders = []
						data.ordersDates = []
					}
					data.lastPageHasData = false
					return
				}

				ordersData.forEach(orderData => {
					orders.push(new Order(orderData))
				});

				let ordersDates:Array<Date> = getUniqueDates(orders
				.map((order:Order) => order.startAt)).reverse()

				if (isAddToList) {
					data.orders.push(...orders)
					data.ordersDates.push(...ordersDates)
				} else {
					data.orders = orders
					data.ordersDates = ordersDates
				}
			})
		}
		updateOrders()

		let saveOldOrders:boolean = true
		let removeOldOrders:boolean = false

		const updateOrdersWithoutSave = () => {
			orderFilters.page = 0
			updateOrders(removeOldOrders)
		}
		watch(() => orderFilters.title, 			updateOrdersWithoutSave)
		watch(() => orderFilters.date,				updateOrdersWithoutSave)
		watch(() => orderFilters.workerId,			updateOrdersWithoutSave)
		watch(() => orderFilters.status,			updateOrdersWithoutSave)
		watch(() => orderFilters.type,				updateOrdersWithoutSave)
		watch(() => orderFilters.isRegularCustomer,	updateOrdersWithoutSave)

		let getDateOrders = (date:Date):Array<Order> => {
			return data.orders.filter((order:Order) => isEqual(order.startAt, date))
		}
		
		let openOrderDetails = (order:Order) => {
			data.orderDetails = order
			data.orderDetailsIsOpen = true
			setTimeout(() => {
				data.filtersIsVisible = false
				store.dispatch('update-show-header', false)
			}, 400 )
		}
		
		let closeOrderDetails = () => {
			data.orderDetails = undefined
			data.orderDetailsIsOpen = false
			setTimeout(() => {				
				data.filtersIsVisible = true
				store.dispatch('update-show-header', true)
			}, 150)	
		}

		let onSearchHandler = (ev:CustomEvent) => {
			orderFilters.title = ev.detail.value
		}
 
		const dateFormatString = computed(() => {
			let date = orderFilters.date
			return date ? yyyymmdd(date) : null 
		})
		const toggleDatepicker = () => {
			data.datePickerIsOpen = !data.datePickerIsOpen
			data.moreFiltersIsOpen = false
		}
		const selectDate = (ev:CustomEvent) => {
			let newDate:Date = new Date(ev.detail.value)
			if (orderFilters.date && isEqual(newDate, orderFilters.date)) {
				orderFilters.date = null
			} else {
				orderFilters.date = newDate
			}
			toggleDatepicker()	
		}

		const infinityScrollHandler = (ev:any) => {
			orderFilters.page += 1
			
			updateOrders(saveOldOrders).then(() => {
				if (!ev.target) return
				ev.target.complete()
			})
		}

		const toggleMoreFilters = () => {
			data.moreFiltersIsOpen = !data.moreFiltersIsOpen
			data.datePickerIsOpen = false
		}

		return { 
			data,
			getDateString,
			getDateOrders,
			checkDate,
			openOrderDetails,
			closeOrderDetails,
			calendarOutline,
			optionsOutline,
			onSearchHandler,
			dateFormatString,
			toggleDatepicker,
			selectDate,
			orderFilters,
			infinityScrollHandler,
			toggleMoreFilters,
		}
	},
}
</script>

<style scoped>
ion-list{
	background: none;
}

ion-searchbar{
	padding: 0;
}

ion-header {
	margin: 0 14px;
	width: calc(100% - 28px);
}

ion-header > ion-card{
	margin: 0;
	position: relative;
}

ion-list {
	padding: 0 4px;
}


.filters-container{
	top: 59px;
	position: fixed;
	z-index: 2;
	right: 14px;

}

.toolbar{
	display: grid;
	grid-template-columns: calc(100% - 24px - 16px - 24px - 16px) 24px 24px;
	column-gap: 16px;
	padding: 4px 12px;
	width: 100%;
}

.calendar-button{
	display: flex;
	align-items: center;
}

.filter-enter-active {
	animation: fade .2s ease-in-out;
}

.filter-leave-active {
	animation: fade .2s ease-out reverse;
}

@keyframes fade {
	from {
		opacity: 0;
		top: -56px
	}
	to {
		opacity: 1;
		top: 0;
	}
}

.datetime-container{
	position: fixed;
	top: 60px;
	height: 344px;
	width: 100%;
	z-index: 1;
}

@media (min-width: 768px) {
	.datetime-container{
		width: fit-content;
		right: 14px;	
	}

	.filters-container{
		width: 350px;
	}
}	

@media (max-width: 768px) {

	.datetime-container{
		width: fit-content;
		left: 14px;	
	}
	.datetime-container > ion-datetime{
		max-width: 400px;
		width: calc(100% - 24px);
	}

	.filters-container{
		max-width: 400px;
		left: 14px;
	}
}

.datetime-enter-active{
	animation: datetime .4s;	
}
.datetime-leave-active{
	animation: datetime .4s reverse;
}

@keyframes datetime {
	from{
		max-height: 0;
		opacity: 0;
	}
	to{
		max-height: 344px;
		opacity: 1;
	}
}

.empty{
	height: calc(100% - 70px);
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.2em;
	color: var(--ion-color-step-500);
}
</style>