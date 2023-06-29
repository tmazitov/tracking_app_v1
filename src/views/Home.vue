<template>
	<ion-page>
		<OrderDetails
			:order="data.orderDetails"
			:isOpen="data.detailsIsOpen"
			:closer="closeDetails"
		/>
		<OrderCreateForm
			v-if="filters.date"
			:date="filters.date"
			:isOpen="data.createFormIsOpen"
			:closer="closeCreateForm"
		/>
		<ion-content :fullscreen="true">
			<div class="content__container">

				<DateViewer v-if="filters.date" v-model:date="filters.date" />
				<div class="tools__container">
					<div class="search__container">
						<ion-searchbar v-model="data.searchField" :debounce="1000"></ion-searchbar>
					</div>
					<div class="filters__button" @click="toggleFilters">
						<img src="/options-outline.svg" height="24">
					</div>
				</div>
				<div class="filters__container">
					<OrderListFilters :filters="filters" :isOpen="data.filtersIsOpen"/>
				</div>
				<div class="order_card_container" v-if="searchedOrders.length > 0">
					<transition-group name="order-item">
						<OrderCardSmall 
						v-for="order in searchedOrders" 
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
			<ion-fab slot="fixed" vertical="bottom" horizontal="end" 
			v-if="user.roleId != 1 && !data.detailsIsOpen && !data.createFormIsOpen">
				<ion-fab-button @click="openCreateForm">
					<ion-icon :icon="addOutline"></ion-icon>
				</ion-fab-button>
			</ion-fab>
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
IonFab,
IonFabButton,
IonIcon,
} from "@ionic/vue";
import { addOutline, optionsOutline, podiumOutline } from "ionicons/icons";
import { reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import {  useRouter } from "vue-router";
import Order from "@/assets/order";
import OrderDetails from "@/components/OrderDetails.vue";
import OrderCard from "@/components/OrderCard.vue";
import OrderCardSmall from "@/components/OrderCardSmall.vue";
import OrderListFilters from "@/components/OrderListFilters.vue"
import { newOrderListFilters} from "@/assets/orderListFilters"
import DateViewer from "@/components/DateViewer.vue";
import OrderCreateForm from '@/components/forms/order-create-form/OrderCreateForm.vue';

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
		DateViewer,
		IonSearchbar,
		IonInput,
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonBackdrop,
		IonButton,
		IonList,
		IonItem,

		IonFab,
		IonFabButton,
		IonIcon,

		OrderCard,
		OrderCardSmall,
		OrderDetails,
		OrderListFilters,
		OrderCreateForm,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const data = reactive<{
			searchField: string,
			filtersIsOpen: boolean,
			detailsIsOpen: boolean,
			createFormIsOpen: boolean,
			orderDetails: Order|undefined,
		}>({
			searchField: "",
			filtersIsOpen: false,
			detailsIsOpen: false,
			createFormIsOpen: false,
			orderDetails: undefined,
		});

		const filters = newOrderListFilters()
		store.dispatch("ws-update-filters", filters)
		store.dispatch("setup-order-list", filters)
		watch(filters, (() => {
			const newFiltersQuery = filters.toPageUrlQuery()
			router.push({
				name: "home",
				query: newFiltersQuery,
			})
			store.dispatch("setup-order-list", filters)
			store.dispatch("ws-update-filters", filters)
		}))

		const user = computed(() => store.getters.userMainInfo);
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

		const openCreateForm = () => {
			data.createFormIsOpen = true
		}

		const closeCreateForm = () => {
			data.createFormIsOpen = false
		}

		const toggleFilters = () => data.filtersIsOpen = !data.filtersIsOpen

		watch(router.currentRoute, (currentRoute) => {
			if (currentRoute.name == "home") {
				store.dispatch("setup-order-list", filters)
				store.dispatch("ws-update-filters", filters)
			}
		})

		return {
			user,
			data,
			filters,
			openCreateForm,
			closeCreateForm,
			optionsOutline,
			searchedOrders,
			orders,
			openDetails,
			closeDetails,
			addOutline,
			podiumOutline,
			toggleFilters
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
	position: relative;
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
	padding: 0 10px;
	animation: .3s order-item;
}

.order_card_container.empty{
	justify-content: center;
	align-items: center;
	color: var(--ion-color-step-400)
}

.tools__container {
	display: flex;
	flex-direction: row;
	gap: 16px;
	padding-right: 10px;
	position: relative;
	width: 100%;
}

.filters__container{
	position: fixed;
	right: 10px;
	z-index: 2;
}

@media (min-width: 768px) {
	.order_card_container{
		height: calc(100% - 112px - 40px);
	}

	.filters__container{
		width: 350px;
	}
}

@media (max-width: 768px) {
	.content__container
	.order_card_container{
		height: calc(100% - 124px);
		padding-bottom: 30px;
	}

	.filters__container{
		left: 14px;
	}
}

.search__container {
	width: 100%;
}

.filters__button{
	display: flex;
	align-items: center;
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

.table-view-toggle {
	display: flex;
	align-items: center;
}

.table-view-toggle > ion-icon {
	height: 24px;
	width: 24px;
}
</style>
