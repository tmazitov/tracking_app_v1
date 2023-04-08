<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Главная</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<ion-header collapse="condense">
				<ion-toolbar>
					<ion-title size="large">Главная</ion-title>
				</ion-toolbar>
			</ion-header>
			<div class="content__container">
				<div class="tools__container">
					<DateViewer />
					<div class="search__container">
						<ion-input type="text" v-model="data.searchField" label="Поиск заказа" label-placement="floating"
							fill="solid">
						</ion-input>
					</div>
				</div>
				<div class="order_card_container">
					<OrderCard v-for="(order, index) in searchOrder(orders, data.searchField)" :key="`order_card_${index}`"
						:order="order" />
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
} from "@ionic/vue";
import DateViewer from "@/components/DateViewer.vue";
import OrderCard from "@/components/OrderCard.vue";
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import Order from "@/assets/order";

const searchOrder = (orders: Array<Order>, searchString: string) => {
	let low = searchString.toLowerCase();
	return orders.filter((order: Order) => {
		let littleTitle = order.points[0].title.toLowerCase();
		console.log(
			"littleTitle :>> ",
			littleTitle,
			littleTitle.includes(low),
			order.orderId
		);
		return littleTitle.includes(low);
	});
};

export default {
	name: "HomePage",
	components: {
		IonInput,
		IonPage,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		DateViewer,
		OrderCard,
	},
	setup() {
		const store = useStore();
		const data = reactive({
			searchField: "",
		});
		const user = computed(() => store.getters.userMainInfo);

		store.dispatch("setup-order-list");
		const orders = computed(() => store.getters.orderList);

		return {
			user,
			data,
			searchOrder,
			orders,
		};
	},
};
</script>

<style scoped>
.content__container {
	max-width: 800px;
	margin: auto;
}

.tools__container {
	display: flex;
}

.search__container {
	width: 230px;
	margin: 10px;
}
</style>
