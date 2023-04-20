<template>
	
	<ion-page>
		
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large"><DateViewer /></ion-title>
				</ion-toolbar>
			</ion-header>
			<div class="content__container">
				<div class="tools__container">
					<div class="tools__fields">
						<div class="search__container">
							<ion-searchbar v-model="data.searchField" :debounce="1000"></ion-searchbar>
						</div>
					</div>
				</div>
				<div class="order_card_container">
					<OrderCard v-for="order in searchedOrders" :key="`order__${order.orderId}`" :order="order" />
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
import { reactive, computed, ref, ComputedRef, Ref } from "vue";
import { useStore } from "vuex";
import Order from "@/assets/order";

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
		IonBackdrop,
		IonButton,
		IonList,
		IonItem,
	},
	setup() {
		const store = useStore();
		const data = reactive<{
			searchField:string
		}>({
			searchField: "",
		});

		const user = computed(() => store.getters.userMainInfo);

		store.dispatch("setup-order-list");
		const orders = computed(() => {
			return store.getters.orderList
		})

		const searchedOrders = computed(() => {
			return searchOrder(orders.value, data.searchField)
		})

		return {
			user,
			data,
			searchedOrders,
			orders,
		};
	},
};
</script>

<style scoped>
.content__container {
	max-width: 800px;
	margin: auto;
	padding: 0 20px;
	height: 100%;
}

.order_card_container{
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding-bottom: 30px;
	padding-right: 20px;
}

.tools__container {
	display: flex;
	align-items: center;
}

@media (min-width: 700px) {
	.order_card_container{
		height: calc(100% - 56px);
	}
}

@media (max-width: 700px) {
	.content__container
	.order_card_container{
		height: calc(100% - 85px);
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
	margin: 10px 0;
	position: sticky;
}
</style>
