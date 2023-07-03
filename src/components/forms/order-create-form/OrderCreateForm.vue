<template>

	<ion-toast :is-open="data.orderCreatedIsOpen"
      	message="Заказ успешно создан!"
	    :duration="5000"
		layout="stacked"
		color="success"
		:icon="checkmarkCircleOutline">
	</ion-toast>
	
	<transition name="modal">
		<div class="order_create_form" v-if="isOpen">

			<CreateOrderBillModal
				v-if="data.priceList"
				:isOpen="data.billIsOpen"
				:closer="closeBill"
				:form="form"
				:submit="orderSubmit"
				:priceList="data.priceList"
			/>

			<div class="form">	
				<div class="form__header">
					<div class="header__go-back" @click="close()">
						<ion-icon :icon="arrowBackOutline"></ion-icon>
					</div>
					<div class="header__title">
						Создать заказ
					</div>
				</div>

				<div class="form__tabs">
					<div class="form__tab" @click="() => selectTab(0)" v-bind:class="{
						selected: form.selectedTab == 0,
					}">Инфо</div>
					<div class="form__tab" @click="() => selectTab(1)" v-bind:class="{
						selected: form.selectedTab == 1,
					}">Точки - {{form.points.length}}</div>
				</div>
				
	
				<div class="form__tabs-content">
					<div class="form__page-1" v-if="form.selectedTab == 0">
						
						<div class="form__datetime-title">
							<!-- Datetime -->
	
							<div class="form__datetime">
								<div class="datetime__date">
									<ion-input 
									type="date" v-model="form.date" 
									label="Дата" label-placement="floating" fill="solid">
									</ion-input>
			
									<ion-input 
									type="time" v-model="form.start"
									label="Начало" label-placement="floating" fill="solid">
									</ion-input>
								</div>

								<div class="datetime__duration">
	
									<ion-input 
									type="number" v-model="form.duration" :min="data.priceList?.bigCarTime"
									label="Часы работы" label-placement="floating" fill="solid">
									</ion-input>

									<div class="ion-activatable ripple-parent form__helpers-button"  
									@click="() => form.duration += 1">
										<ion-icon :icon="add"></ion-icon>
										<ion-ripple-effect></ion-ripple-effect>
									</div>
									<div class="ion-activatable ripple-parent form__helpers-button" 
									@click="() => {if (form.duration > 2) form.duration -= 1}">
										<ion-icon :icon="remove" ></ion-icon>
										<ion-ripple-effect></ion-ripple-effect>
									</div>
								</div>
							</div>
	
							<!-- Title -->
			
							<div class="form__title-container">
								<ion-input type="text" v-model="form.title" label="Название заказа" fill="solid" label-placement="floating" placeholder="По умолчанию адрес первой точки">
								</ion-input>
							</div>
	
						</div>
	
						<!-- Comment -->
		
						<div class="form__comment-container">
							<ion-textarea label="Комментарий заказа" labelPlacement="floating" fill="solid" v-model="form.comment">
							</ion-textarea>
						</div>
		
						<RSelector
							v-model:current-item="form.currentOrderType"
							:items="orderTypes" 
							:selector="selectOrderType"
							:label="'Тип заказа'"
							:multiple="true"
						/>
	
						<!-- Is Regular customer -->
						<ion-checkbox labelPlacement="end" v-model="form.isRegularCustomer">Постоянный клиент</ion-checkbox>
	
						<!-- Make the table of worker business -->

					</div>
					<div class="form__page-2" v-if="form.selectedTab == 1">
						<OrderPointsMap v-model:points="form.points" v-model:wayHours="form.duration" v-model:km-count="form.price.kmCount"/>
					</div> 

				</div>
				
				<div class="form__submit-container" v-if="form.selectedTab == 0">
					<ion-button @click="openBill">Создать</ion-button>
				</div>
			</div>
		</div>
	</transition>
</template>



<script lang="ts">
import OrderPointsMap from "../../map/OrderPointsMap.vue";
import CreateOrderBillModal from "../../modal/CreateOrderBillModal.vue"
import { IonTitle, IonIcon, IonInput, IonSelect, IonSelectOption, IonTextarea, IonCheckbox, IonButton, IonRippleEffect, IonToast } from "@ionic/vue";
import { add, arrowBackOutline, checkmarkCircleOutline, remove } from "ionicons/icons";
import { ComputedRef, computed, reactive, watch } from "vue";
import User from "@/assets/user";
import RSelector from '../../inputs/RSelector.vue'
import SelectableItem from "@/assets/selectableItem";
import TMS from "@/api/tms";
import { UTCString } from "@/assets/data";
import "./tabs.css"
import { useStore } from "vuex";
import { isEqual, yyyymmdd } from "@/assets/date";
import { IOrderCreateForm, getDefaultForm } from "./instanse";
import Order from "@/assets/order";
import OrderPriceList from "@/assets/orderPriceList";

interface SelectorsData {
	workers: ComputedRef<Array<User>>
	orderTypes: Array<SelectableItem>
}

interface IOrderStorage {
	orders: Array<Order>
}

export default {
	name: "OrderCreateForm",
	components: {
		OrderPointsMap,
		IonTitle,
		IonInput,
		IonToast,
		IonTextarea,
		IonIcon,
		IonCheckbox,
		RSelector,
		IonButton,
		IonSelect, IonSelectOption,
		IonRippleEffect,
		CreateOrderBillModal,
	},

	props: {
		isOpen: {
			type: Boolean,
			required: true,
		},
		closer: {
			type: Function,
			required: true,
		},
		date: {
			type: Date,
		},
		storage: {
			type: Object as () => IOrderStorage,
			required: true,
		}
	},

	setup(props) {
		const store = useStore()
		const data = reactive<{
			billIsOpen: boolean,
			priceList: OrderPriceList|null,
			orderCreatedIsOpen: boolean,
		}>({
			billIsOpen: false,
			priceList: null,
			orderCreatedIsOpen: false,
		})


		const form = reactive<IOrderCreateForm>(getDefaultForm());
		if (props.date){
			form.date = yyyymmdd(props.date)
			watch(() => props.date, () => {
				if (!props.date) return
				form.date = yyyymmdd(props.date)
			})
		}


		const isOpen = computed(() => {
			let isOpen = props.isOpen
			if (isOpen) 
			{
				TMS.order().priceList().then(response => {
					if (!response.data) return
					if (response.data.err) throw response.data.err

					data.priceList = new OrderPriceList(response.data)
					form.duration = data.priceList.bigCarTime
				})
			}
			return isOpen
		})
		const workers = computed(() => store.getters.staffWorkers)
		const selectWorker = (workerId:number) => {
			form.currentWorkerId = workerId == -1 ? 0 : workerId
		}

		const selectOrderType = (orderType:Array<number>) => {
			form.currentOrderType = orderType
		}

		const orderTypes =  [
			{value: 1, title: "Город"},
			{value: 2, title: "Пригород"},
			{value: 4, title: "Меж. город"},
		]


		const selectTab = (index: number) => (form.selectedTab = index);

		const openBill = () => data.billIsOpen = true
		const closeBill = () => data.billIsOpen = false

		const openCreatedOrder = () => data.orderCreatedIsOpen = true
		const closeCreatedOrder = () => {
			data.orderCreatedIsOpen = false
		}

		const orderSubmit = () => {

			let startDate = new Date(form.date + " " + form.start)

			let endDate = new Date(startDate.getTime())
			endDate.setHours(startDate.getHours() + form.duration)

			TMS.order().create({
				title: form.title,
				startAt: UTCString(startDate),
				endAt:   UTCString(endDate),
				points: form.points,
				workerId: form.currentWorkerId,
				orderType: form.currentOrderType.reduce((a, b) => a + b),
				comment: form.comment,
				isRegularCustomer: form.isRegularCustomer,
				price: form.price,
			}).then(response => {
					
				if (response.data && response.data["err"]) throw response.data["err"]
				Object.assign(form, getDefaultForm())

				let order:Order = new Order(response.data)
				let date:Date|undefined = props.date
				if (date && isEqual(order.startAt, date)){
					props.storage.orders.push(order)
				}
			
				closeBill()
				props.closer()
				setTimeout(() => {
					openCreatedOrder()
					setTimeout(() => {
						closeCreatedOrder()
					}, 5000)
				}, 500)
			})
		}



		return {
			remove,
			isOpen,
			close: props.closer,
			add,
			data,
			form,
			workers,
			orderTypes,
			selectTab,
			orderSubmit,
			selectWorker,
			selectOrderType,
			arrowBackOutline,

			openBill,
			closeBill,
			closeCreatedOrder,
			checkmarkCircleOutline,
		};
	},
};
</script>

<style lang="css" scoped>
@import url(../../../theme/variables.css);

.form__header{
	font-size: 20px;
	display: flex;
	flex-direction: row;
	gap: 10px;
}

.header__title{
	font-size: 24px;
}

.form__header > * {
	display: flex;
	align-items: center;
}
	
.order_create_form{
	height: 100%;
	position: absolute;
	z-index: 2;
	top: 0;
	right: 0;
	left: 0;	
	background: var(--ion-background-color);
}
.form {
	height: 100%;
	width: 100%;
	min-width: 350px;
	max-width: 640px;

	padding: 16px;

	display: flex;
	flex-direction: column;
	gap: 16px;
}

.form__datetime-title{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.form__datetime{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.datetime__date{
	display: flex;
	flex-direction: row;
	gap: 16px;
}

.datetime__duration{
	display: grid;
    grid-template-columns: calc(100% - 16px - 56px - 16px - 56px) 56px 56px;
    grid-column-gap: 16px;
}

@media (max-width: 768px){
	.form {
		width: 100vw;
	}

	.form__tabs-content{
		height: 100%;
		overflow: auto;
	}



	.from__order-type{
		display: flex;
		flex-direction: column;
		gap: 16px;
	}	

}

@media (min-width: 768px) {
	.form {
		width: 60vw;
		background: var(--ion-color-step-100);
		border-radius: 4px;
		height: 100%;
		gap:0;
	}

	.form__datetime{
		flex-direction: row;
	}

	.order_create_form{
		padding: 50px 0;
		height: 100%;
	}
	.form__tabs-content{
		height: 100%;
		padding: 20px;
	}

	.from__order-type{
		display: grid;
		grid-template-columns: calc(50% - 8px) calc(50% - 8px);
		grid-column-gap: 16px;
	}
}

.form__page-3{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.form__time {
	display: flex;
	flex-direction: row;
	gap: 16px;
}

.form__page-1{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.form__tabs-content{
	overflow-y: auto;
}

ion-checkbox::part(container) {
	border-radius: 6px;
	border: 2px solid var(--ion-color-primary);
}

ion-checkbox{
	width: fit-content;
}

.form__submit-container{
	display: flex;
	justify-content: center;
}

.form__submit-container > ion-button{
	width: 100%;
}

.form__helpers{
	display: grid;
	grid-template-columns: calc(100% - 16px - 56px - 16px - 56px) 56px 56px; 
	grid-column-gap: 16px; 
}

.form__helpers-button {
	display: flex;
	justify-content: center;
	align-items: center;

	background: var(--ion-color-step-50, #f2f2f2);
	border-radius: 4px;

	width: 56px;
	height: 56px;
	cursor: pointer;
}

.ripple-parent {
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    overflow: hidden;

    user-select: none;
}


.modal-enter-active{
	animation: .45s modal cubic-bezier(0.76, 0.03, 0.54, 0.96);
}
.modal-leave-active{
	animation: .45s modal reverse cubic-bezier(0.76, 0.03, 0.54, 0.96);
}

@keyframes modal {
	from {
		left: 100vw;
	}
	to {
		left: 0;
	}
}
</style>
