<template>

	<ion-page>

		<ion-content  :fullscreen="true">



			<OrderDetails
				:order="data.orderDetails"
				:isOpen="data.orderDetailsIsOpen"
				:closer="closeOrderDetails"
			/>	

			<div class="filters-container">
				<OrderListFilters :filters="data.storage.filters" :isOpen="data.moreFiltersIsOpen"/>
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
			
			<ion-list class="card-list">
				<transition name="filter">
					<ion-card v-if="data.filtersIsVisible" class="tools-container">
						<ion-toolbar >
							<div class="toolbar">
								<div class="searchbar">
									<ion-searchbar
									:debounce="200" 
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
				</transition>
				<div class="orders-date" 
				v-if="data.ordersDates.length > 0"
				v-for="date in data.ordersDates" 
				:key="`order-date-${date.toLocaleDateString()}`">
					<ion-title>
						{{ checkDate(date) == -1? getDateString(date) : `${checkDate(date)} ${getDateString(date)}` }}
					</ion-title>
					<OrderCardSmall 
					v-for="order in getDateOrders(date)" :key="`order-${order.orderId}`"
					:order="order" :openDetails="openOrderDetails"/>
				</div>
				<div v-else class="empty">
					Заказы не найдены
				</div>
			</ion-list>
			
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
import { IonPage, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSearchbar, IonHeader, IonToolbar, IonDatetime, IonTitle } from '@ionic/vue';
import { ComputedRef, computed, onMounted, reactive, watch } from 'vue';
import OrderCardSmall from '@/components/OrderCardSmall.vue';
import OrderDetails from '@/components/OrderDetails.vue';
import { calendarOutline, optionsOutline, remove } from 'ionicons/icons';
import OrderListFilters from '@/components/OrderListFilters.vue';
import { useStore } from 'vuex';
import OrderStorage from '@/assets/orderStorage';

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
		IonTitle,
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
			storage: OrderStorage,
			ordersDates: Array<Date>
			orderDetails: Order|undefined,
			orderDetailsIsOpen: boolean,
			filtersIsVisible: boolean,
			moreFiltersIsOpen: boolean,
			datePickerIsOpen: boolean,
			lastPageHasData: boolean,
		}>({
			storage: new OrderStorage({
				filtersOptions: {
					nonDate: true,
				}
			}),
			ordersDates: [],
			orderDetails: undefined,
			orderDetailsIsOpen: false,
			filtersIsVisible: true,
			moreFiltersIsOpen: false,
			datePickerIsOpen: false,
			lastPageHasData: true,
		})

		let updateOrders = (saveOldOrders:boolean=true) => {
			return data.storage.updateOrders({saveOldOrders:saveOldOrders}).then((newOrders:Array<Order>) => {
				console.log('newOrders :>> ', newOrders);

				let ordersDates:Array<Date> = getUniqueDates(newOrders
				.map((order:Order) => order.startAt))
					
				if (saveOldOrders) {
					data.ordersDates.push(...ordersDates)
					data.ordersDates = getUniqueDates(data.ordersDates)
				}
				else {
					data.ordersDates = ordersDates
				}
				data.ordersDates.sort((a:Date,b:Date)=>b.getTime()-a.getTime()) 
			})
		}

		updateOrders()

		let saveOldOrders:boolean = true
		let removeOldOrders:boolean = false

		const updateOrdersWithoutSave = () => {
			data.storage.filters.page = 0
			updateOrders(removeOldOrders)
		}
		watch(() => data.storage.filters.title, 			updateOrdersWithoutSave)
		watch(() => data.storage.filters.date,				updateOrdersWithoutSave)
		watch(() => data.storage.filters.workerId,			updateOrdersWithoutSave)
		watch(() => data.storage.filters.status,			updateOrdersWithoutSave)
		watch(() => data.storage.filters.type,				updateOrdersWithoutSave)
		watch(() => data.storage.filters.isRegularCustomer,	updateOrdersWithoutSave)

		let getDateOrders = (date:Date):Array<Order> => {
			return data.storage.orders.filter((order:Order) => isEqual(order.startAt, date))
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
			data.storage.filters.title = ev.detail.value
		}
 
		const dateFormatString = computed(() => {
			let date = data.storage.filters.date
			return date ? yyyymmdd(date) : null 
		})
		const toggleDatepicker = () => {
			data.datePickerIsOpen = !data.datePickerIsOpen
			data.moreFiltersIsOpen = false
		}
		const selectDate = (ev:CustomEvent) => {
			let oldDate:Date|null = data.storage.filters.date
			let newDate:Date = new Date(ev.detail.value)

			let isClearDate:boolean = oldDate != null && isEqual(newDate, oldDate) 
			data.storage.filters.date = isClearDate? null : newDate

			toggleDatepicker()	
		}

		const infinityScrollHandler = (ev:any) => {
			data.storage.filters.page += 1
			
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
	width: 100%;
	padding: 8px 4px;
	box-shadow: none;
}

ion-content{
	margin-top: 16px;
}

.header__container::after{
	background-image: none;
}

ion-header > ion-card{
	margin: 0;
	position: relative;
}

ion-card {
	margin: 0;
}

ion-list {
	padding: 0 4px;
	padding-bottom: 10px;

}

ion-list.card-list{
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 16px;
}


.order-details__header {
	padding: 0;
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
	top: 70px;
	left: 0;
	height: 344px;
	width: 100%;
	z-index: 1;
	box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	border-radius: 8px;
	overflow: hidden;	
}

.filters-container{
	top: 70px;
	position: fixed;
	z-index: 2;
	right: 4px;
}

.filters-container > * {
	width: 100%;
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
		left: 4px;
		width: calc(100% - 8px);
	}
	.datetime-container > ion-datetime{
		max-width: 400px;
		width: 100%;
	}

	.filters-container{
		max-width: 400px;
		width: calc(100% - 8px);
	}
}

.orders-date{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.orders-date > ion-title{
	padding: 0;
}

.tools-container{
	position: sticky;
	top: 0;
	z-index: 1;
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