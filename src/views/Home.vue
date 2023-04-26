<template>
	<ion-page>
		<OrderDetails
			:isOpen="data.detailsIsOpen"
			:closer="closeDetails"
			:order="data.orderDetails"
		/>
		<ion-content :fullscreen="true">
			<div class="content__container">
				<DateViewer v-model:date="filters.date" />
				<div class="tools__container">
					<div class="tools__fields">
						<div class="search__container">
							<ion-searchbar v-model="data.searchField" :debounce="1000"></ion-searchbar>
						</div>
					</div>
				</div>
				<div class="order_card_container" v-if="searchedOrders.length > 0">
					<transition-group name="order-item">
						<OrderCard v-for="order in searchedOrders" 
						:key="`order__${order.orderId}`" 
						:order="order"
						:openDetails="openDetails"
						/>
					</transition-group>
				</div>
				<div class="order_card_container empty" v-else>
					Заказы не найдены
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonInput,
	IonContent,
	IonBackdrop,
	IonButton,
	IonSearchbar,
	IonItem,
	IonList,
} from "@ionic/vue";
import DateViewer from "@/components/DateViewer.vue";
import OrderCard from "@/components/OrderCard.vue";
import { reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import Order from "@/assets/order";
import OrderDetails from "@/components/OrderDetails.vue";
import { useRoute, useRouter } from "vue-router";
import { yyyymmdd } from "@/assets/date";

const searchOrder = (orders: Array<Order>, searchString: string) => {
	let low = searchString.toLowerCase();
	return orders.filter((order: Order) => {
		let littleTitle = order.title.toLowerCase();
		return littleTitle.includes(low);
	});
};

export default {
	name: "HomePage",
	components: {

		IonSearchbar,
		IonInput,
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		DateViewer,
		OrderCard,
		OrderDetails,
		IonBackdrop,
		IonButton,
		IonList,
		IonItem,
	},
	setup() {
		const route = useRoute();
		const store = useStore();
		const router = useRouter();
		const data = reactive<{
			searchField: string,
			detailsIsOpen: boolean,
			orderDetails: Order|undefined,
		}>({
			searchField: "",
			detailsIsOpen: false,
			orderDetails: undefined,
		});	


		let queryDate = route.query["d"]
		let initDate:Date 
		if (queryDate){
			initDate = new Date(queryDate.toString())
		} else {
			initDate = new Date()
		}
		const filters = reactive({
			date: initDate,
		})

		watch(()=>filters.date, (date:Date,oldDate:Date) => {
			let dateIsChanged = date.getDate() != oldDate.getDate() || 
				date.getMonth() != oldDate.getMonth() || 
				date.getFullYear() != oldDate.getFullYear()
			
			if (dateIsChanged){
				store.dispatch("setup-order-list", filters)
				let currentParams = {...route.query}
				currentParams["d"] = yyyymmdd(date)

				if (!route.name) return
				router.push({name:route.name, query:currentParams})
			} 
		})

		const user = computed(() => store.getters.userMainInfo);

		store.dispatch("setup-order-list", filters)
		const orders = computed(() => {
			return store.getters.orderList.sort((a:Order, b:Order) => {
				return a.startAt.getTime() - b.startAt.getTime();
			})
		})

		const searchedOrders = computed(() => {
			return searchOrder(orders.value, data.searchField)
		})

		const openDetails = (order:Order) => {
			data.orderDetails = order
			data.detailsIsOpen = true
			store.dispatch('toggle-tabs')
		}

		const closeDetails = () => {
			data.orderDetails = undefined
			data.detailsIsOpen = false
			store.dispatch('toggle-tabs')
		}

		return {
			user,
			data,
			filters,
			searchedOrders,
			orders,
			openDetails,
			closeDetails,
		};
	},
};
</script>

<style scoped>
@import url(../theme/variables.css);
.content__container {
	max-width: 800px;
	margin: auto;
	height: 100%;
}

@media (max-width:768px) {
	.content__container{
		padding: 0 10px;
	}
}

.order_card_container{
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding-right: 20px;
	animation: .3s order-item;
}

.order_card_container.empty{
	justify-content: center;
	align-items: center;
	color: var(--ion-color-step-400)
}

.tools__container {
	display: flex;
	align-items: center;
}

@media (min-width: 768px) {
	.order_card_container{
		height: calc(100% - 112px - 40px);
	}
}

@media (max-width: 768px) {
	.content__container
	.order_card_container{
		height: calc(100% - 124px);
		padding-bottom: 30px;
	}
	.tools__container {
		display: block;
	}
}

.tools__fields{
	display: inline-flex;
	gap: 16px;
	align-items: center;
	width: fit-content;
}

.search__container {
	width: 230px;
}

.footer{
	height: 40px;
}

.order-item-enter-active{
	animation: .3s order-item;
}

.order-item-leave-active{
	animation: .3s order-item reverse;
}

@keyframes order-item {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
