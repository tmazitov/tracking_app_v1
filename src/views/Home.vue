<template>
	<ion-page>
		<OrderDetails
			:order="data.orderDetails"
			:orderOpenEdit="openCreateForm"
			:isOpen="data.detailsIsOpen"
			:closer="closeDetails"
		/>
		<OrderCreateForm
			v-if="storage.filters.date"
			:date="storage.filters.date"
			:isOpen="data.createFormIsOpen"
			:storage="storage"
			:closer="closeCreateForm"
		/>
		<ion-content :fullscreen="true">
			<div class="content__container">

				<DateViewer v-if="storage.filters.date" v-model:date="storage.filters.date" />
				<div class="tools__container">
					<div class="search__container">
						<ion-searchbar 
						placeholder="Поиск" mode="ios" @ionInput="onSearchHandler" ></ion-searchbar>
					</div>
					<div class="filters__button" @click="toggleFilters">
						<img src="/options-outline.svg" height="24">
					</div>
				</div>
				<div class="filters__container">
					<OrderListFilters :filters="storage.filters" :isOpen="data.filtersIsOpen"/>
				</div>
				<div class="order_card_container" v-if="storage.orders.length > 0">
					<transition-group name="order-item">
						<OrderCardSmall 
						v-for="order in storage.orders" 
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
onIonViewDidEnter,
} from "@ionic/vue";
import { addOutline, optionsOutline, podiumOutline } from "ionicons/icons";
import { reactive, computed, watch, ref } from 'vue';
import { useStore } from "vuex";
import {  useRouter } from "vue-router";
import Order from "@/assets/order";
import OrderDetails from "@/components/OrderDetails.vue";
import OrderCard from "@/components/OrderCard.vue";
import OrderCardSmall from "@/components/OrderCardSmall.vue";
import OrderListFilters from "@/components/OrderListFilters.vue"
import DateViewer from "@/components/DateViewer.vue";
import OrderCreateForm from '@/components/forms/order-create-form/OrderCreateForm.vue';
import OrderUpdateHub from "@/assets/orderUpdateHub";
import OrderStorage from "@/assets/orderStorage";

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
		const store = useStore()
		const router = useRouter()
		const storage = ref(new OrderStorage())

		const data = reactive<{
			// storage: OrderStorage,
			searchField: string,
			filtersIsOpen: boolean,
			detailsIsOpen: boolean,
			createFormIsOpen: boolean,
			orderDetails: Order|undefined,
		}>({
			// storage: new OrderStorage(),
			searchField: "",
			filtersIsOpen: false,
			detailsIsOpen: false,
			createFormIsOpen: false,
			orderDetails: undefined,
		});

		onIonViewDidEnter(()=>{
			storage.value.updateOrders()
		})

		
		watch(storage.value.filters, () => {
			storage.value.onFilterUpdate().then((newPageQuery:{[key:string]:any}) => {
				router.push({
					name: "home",
					query: newPageQuery,
				})
			})
		})
		const user = computed(() => store.getters.userMainInfo);

		const openDetails = (order:Order) => {
			data.orderDetails = order
			data.detailsIsOpen = true
			store.dispatch('toggle-tabs', false)
		}

		const closeDetails = () => {
			data.orderDetails = undefined
			data.detailsIsOpen = false
			store.dispatch('toggle-tabs', true)
		}

		const openCreateForm = () => data.createFormIsOpen = true
		const closeCreateForm = () => data.createFormIsOpen = false
		const toggleFilters = () => data.filtersIsOpen = !data.filtersIsOpen

		let onSearchHandler = (ev:CustomEvent) => {
			storage.value.filters.title = ev.detail.value
		}

		return {
			user,
			data,
			storage,
			openCreateForm,
			closeCreateForm,
			optionsOutline,
			openDetails,
			closeDetails,
			addOutline,
			podiumOutline,
			toggleFilters,
			onSearchHandler
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
