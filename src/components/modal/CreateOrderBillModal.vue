<template>
	<transition name="bill">
		<div class="bill" v-if="isOpen">
			<div class="bill__header">
				<div class="header__close-button" @click="closer()">
					<ion-icon :icon="arrowBackOutline"></ion-icon>
				</div>
				<div class="header__title">
					Итоговая стоимость
				</div>
			</div>

			<div class="content">
				<div class="bill__prices">
					<transition name="fade">
						<div class="price" v-if="data.carIsVisible">
							<div class="price__title">Машина</div>
							<div class="price__calc">
								<div class="price__hour-price">{{bill.carPrice}} ₽</div>
								<div>x</div>
								<div class="price__hour-value">{{bill.carHours}} ч.</div>
								<div>=</div>
							</div>
							<div class="price__calc-value">{{totalCarPrice}} ₽</div>
							<div class="price__icon-button" @click="editCarOpen">
								<ion-icon :icon="createOutline" color="primary"></ion-icon>
							</div>	
						</div>
					</transition>

					<transition name="car"
					@before-enter="() => data.carIsVisible = false"
					@after-leave="() => data.carIsVisible = true">
						<div class="add__form" v-if="data.editCarIsOpen">

							<div>
								Машина
							</div>

							<div class="form__fields">
								
								<div class="field">
	
									<ion-input 
									label="Цена за час" labelPlacement="fixed"
									v-model="data.newCarPrice" type="number">
									</ion-input>
	
									<ion-button class="button" size="small"
									@click="() => data.newCarPrice += 50">
										<ion-icon :icon="addOutline"></ion-icon>
									</ion-button>
									<ion-button class="button" size="small"
									@click="() => {if (data.newCarPrice) data.newCarPrice -= 50}">
										<ion-icon :icon="removeOutline"></ion-icon>
									</ion-button>
								</div>
	
								<div class="field"> 
									<ion-input 
									label="Количество" labelPlacement="fixed"
									v-model="data.newCarHours" type="number">
									</ion-input>
	
									<ion-button class="button" size="small"
									@click="() => data.newCarHours += 1">
										<ion-icon :icon="addOutline"></ion-icon>
									</ion-button>
									<ion-button class="button" size="small"
									@click="() => {if (data.newCarHours > 2) data.newCarHours -= 1}">
										<ion-icon :icon="removeOutline"></ion-icon>
									</ion-button>
								</div>
							</div>							
							<div class="form__tool-button">
								<ion-button size="small" @click="addCar">Сохранить</ion-button>
								<ion-button size="small" fill="clear" @click="editCarClose">Отмена</ion-button>
							</div>
						</div>
					</transition>

					<transition name="fade">
						<div class="price" v-if="bill.helpersCount != 0 && !data.editHelpersIsOpen && data.helpersIsVisible">
							<div class="price__title">Грузчики</div>
							<div class="price__calc">
								<div class="price__hour-price">{{bill.helpersPrice}} ₽</div>
								<div>x</div>
								<div class="price__hour-value">{{bill.helpersCount}} чел.</div>
								<div>x</div>
								<div class="price__hour-value">{{bill.helpersHours}} ч.</div>
								<div>=</div>
							</div>
							<div class="price__calc-value">{{totalHelperPrice}} ₽</div>
							<div class="price__icon-button" @click="editHelpersOpen">
								<ion-icon :icon="createOutline" color="primary"></ion-icon>
							</div>
						</div>
					</transition>

					<transition name="helpers"
					@before-enter="() => data.helpersIsVisible = false"
					@after-leave="() => data.helpersIsVisible = true">
					
						<div class="add__form" v-if="data.editHelpersIsOpen">
							<div>
								Грузчики
							</div>
	
							<div class="form__fields">
								
								<div class="field">
	
									<ion-input 
									type="number" label="Цена за час" labelPlacement="fixed"
									v-model="data.newHelpersPrice" >
									</ion-input>
	
									<ion-button class="button" size="small"
									@click="() => data.newHelpersPrice += 50">
										<ion-icon :icon="addOutline"></ion-icon>
									</ion-button>
									<ion-button class="button" size="small"
									@click="() => {if (data.newHelpersPrice) data.newHelpersPrice -= 50}">
										<ion-icon :icon="removeOutline"></ion-icon>
									</ion-button>
								</div>
	
								<div class="field"> 
									<ion-input 
									type="number" label="Количество" labelPlacement="fixed"
									v-model="data.newHelpersCount" >
									</ion-input>
	
									<ion-button class="button" size="small"
									@click="() => data.newHelpersCount += 1">
										<ion-icon :icon="addOutline"></ion-icon>
									</ion-button>
									<ion-button class="button" size="small"
									@click="() => {if (data.newHelpersCount) data.newHelpersCount -= 1}">
										<ion-icon :icon="removeOutline"></ion-icon>
									</ion-button>
								</div>
	
								<div class="field">
									<ion-input 
									label="Часы работы" labelPlacement="fixed"
									v-model="data.newHelpersHours" type="number">
									</ion-input>
	
									<ion-button class="button" size="small"
									@click="() => data.newHelpersHours += 1">
										<ion-icon :icon="addOutline"></ion-icon>
									</ion-button>
									<ion-button class="button" size="small"
									@click="() => {if (data.newHelpersHours > 2) data.newHelpersHours -= 1}">
										<ion-icon :icon="removeOutline"></ion-icon>
									</ion-button>
								</div>
							</div>						
	
							<div class="form__tool-button">
								<ion-button size="small" @click="addHelpers">Сохранить</ion-button>
								<ion-button size="small" fill="clear" @click="editHelpersClose">Отмена</ion-button>
							</div>
						</div>

					</transition>

					<transition name="fade">
						<div class="price" v-if="bill.isFragile">
							<div class="price__title">Защитная плёнка</div>
							<div class="price__calc-value">{{priceList?.fragilePrice}} ₽</div>
							<div class="price__icon-button" @click="() => bill.isFragile = false">
								<ion-icon :icon="closeOutline" color="danger"></ion-icon>
							</div>
						</div>
					</transition>


					<div class="price" v-if="form.currentOrderType.includes(4)">
						<div class="price__title">Км. межгород</div>
						<div class="price__calc">
							<div class="price__hour-price">{{form.price.kmCount}} км.</div>
							<div>x</div>
							<div class="price__hour-value">{{priceList.kmPrice}} ₽</div>
							<div>=</div>
						</div>
						<div class="price__calc-value">{{form.price.kmCount*priceList.kmPrice}} ₽</div>
					</div>

					<transition name="fade__button">
						<div class="add__button" 
						v-if="bill.helpersCount == 0 && !data.editHelpersIsOpen && data.helpersIsVisible">
							<ion-button size="small" @click="editHelpersOpen" fill="outline">+ Грузчики</ion-button>
						</div>
					</transition>

					<transition name="fade__button">
						<div class="add__button" v-if="!bill.isFragile">
							<ion-button size="small" fill="outline"
							@click="() => bill.isFragile = true">
								+ Защитная плёнка
							</ion-button>
						</div>
					</transition>

				</div>
			</div>

			<div class="total__price">
				Итого: {{ totalPrice }} ₽
			</div>

			<div class="submit">
				<ion-button @click="submitHandler">Подтвердить</ion-button>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import { IonButton, IonIcon, IonInput, onIonViewDidEnter } from '@ionic/vue';
import { addOutline, arrowBackOutline, closeOutline, createOutline, helpCircleOutline, removeOutline } from 'ionicons/icons';
import { computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { IOrderCreateForm } from '../forms/order-create-form/instanse';
import TMS from '@/api/tms';
import OrderPriceList from '@/assets/orderPriceList';


export default {
	name: 'CreateOrderBillModal',
	components:{
		IonIcon,
		IonInput,
		IonButton,
	},
	props: {
		form: {
			type: Object as () => IOrderCreateForm,
			required: true,
		},
		submit: {
			type: Function,
			required: true,
		},
		isOpen: {
			type: Boolean,
			required: true,
		},
		closer: {
			type: Function,
			required: true,
		},
		priceList: {
			type: OrderPriceList,
			required: true,
		},
	},
	setup(props){
		const store = useStore()

		const isOpen = computed(() => props.isOpen)
		const closer = props.closer

		const priceList = computed(() => props.priceList)
		const orderHours = computed(() => props.form.duration)

		const bill = reactive({
			carPrice: priceList.value.bigCarPrice,
			carHours: orderHours.value,
			isFragile: false,
			helpersPrice: priceList.value.helperPrice, 
			helpersHours: orderHours.value,
			helpersCount: 0,
		})

		watch(() => props.form.duration, (newValue) => {
			bill.helpersHours = newValue
			bill.carHours = newValue
		})



		const data = reactive<{
			editHelpersIsOpen: boolean,
			newHelpersCount: number,	
			newHelpersPrice: number,
			newHelpersHours: number,
			helpersIsVisible: boolean,

			editCarIsOpen: boolean,
			newCarPrice: number,
			newCarHours: number,
			carIsVisible: boolean,
		}>({
			editHelpersIsOpen: false,
			newHelpersCount: 0,
			newHelpersPrice: 0,
			newHelpersHours: 0,
			helpersIsVisible: true,

			editCarIsOpen: false,
			newCarPrice: 0,
			newCarHours: 0,
			carIsVisible: true,
		})

		const totalCarPrice = computed(() => bill.carHours * bill.carPrice)
		const totalHelperPrice = computed(() => bill.helpersHours * bill.helpersPrice * bill.helpersCount)
		const totalPrice = computed(() => {
			if (!priceList.value) return 0
			let price = totalCarPrice.value
			if (totalHelperPrice) price += totalHelperPrice.value
			if (props.form.currentOrderType.includes(4)) price += props.form.price.kmCount*priceList.value.kmPrice
			if (bill.isFragile) price += priceList.value.fragilePrice
			
			return price
		})

		const editHelpersOpen = () => {
			data.newHelpersCount = bill.helpersCount
			data.newHelpersHours = bill.helpersHours
			data.newHelpersPrice = bill.helpersPrice
			data.editHelpersIsOpen = true
		}
		const editHelpersClose = () => data.editHelpersIsOpen = false
		const addHelpers = () => {
			bill.helpersCount = data.newHelpersCount
			bill.helpersHours = data.newHelpersHours
			bill.helpersPrice = data.newHelpersPrice

			editHelpersClose()
		}

		const editCarOpen = () => {
			data.newCarPrice = bill.carPrice
			data.newCarHours = bill.carHours
			data.editCarIsOpen = true
		}
		
		const editCarClose = () => {
			data.editCarIsOpen = false
		}

		const addCar = () => {
			props.form.duration = data.newCarHours
			bill.carPrice = data.newCarPrice
			editCarClose()
		}

		const submitHandler = () => {
			let price = {
				carPrice: Number(bill.carPrice),
				carHours: Number(bill.carHours),
				carTypeId: 1,
				helperCount: Number(bill.helpersCount),
				helperPrice: Number(bill.helpersPrice),
				helperHours: Number(bill.helpersHours),
				kmCount: props.form.price.kmCount,
				kmPrice: priceList.value.kmPrice,
				total: totalPrice.value,
				isFragileCargo: bill.isFragile,
			}

			props.form.price = price
			props.submit()
		}

		return {
			submitHandler,
			closer,
			isOpen,
			bill,
			data,
			form: props.form,
			priceList,

			arrowBackOutline,
			createOutline,
			helpCircleOutline,
			totalCarPrice,
			totalHelperPrice,
			totalPrice,
			
			addHelpers,
			editHelpersOpen,
			editHelpersClose,

			addCar,
			editCarOpen,
			editCarClose,

			closeOutline,
			addOutline,
			removeOutline,
		}
	}
};
</script>

<style scoped>

@import url("../../theme/variables.css");

.bill {
	position: absolute;
	z-index: 4;
	height: calc(100vh - 112px);
	width: 100vw;

	border-radius: 4px;
	background: var( --ion-background-color);
	
	padding: 16px;

	display: flex;
	flex-direction: column;
	gap: 16px;
}

.bill-enter-active{ 
	animation: .45s bill cubic-bezier(0.76, 0.03, 0.54, 0.96);
}

.bill-leave-active{
	animation: .45s bill reverse cubic-bezier(0.76, 0.03, 0.54, 0.96);
}

@keyframes bill {
	from {
		left: 100vw;
	}
	to {
		left: 0;
	}
}

.content{ 
	height: 100%;
}

.bill__header {
	font-size: 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;
}


.header__title{
	font-size: 24px;
}

.header__close-button{
	height: 20px
}

.bill__prices{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.price{ 
	display: flex;
	flex-direction: row;
	gap: 10px;
	color: var(--ion-color-step-900);
}

.price__title{
	width: 100%;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.price__calc{
	display: flex;
	flex-direction: row;
	gap: 6px;
	justify-content: center;
	font-size: 14px;
	color: var(--ion-color-step-550);
}
.price__calc > * {
	white-space: nowrap;
}

.price__calc-value{
	white-space: nowrap;
}

.submit > ion-button{
	width: calc(100% - 4px);
}

.add__button > ion-button{
	width: 100%;
	--border-color: var(--ion-color-step-150);
	--color: var(--ion-color-step-700);
	--font-size: 12px;
}

.add__form{
	padding: 10px;
	border: 2px solid var(--ion-color-primary);
	border-radius: 4px;

	margin: 4px 2px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.form__tool-button{
	display: flex;
	flex-direction: row;
	gap: 10px;
}

.form__tool-button > ion-button{
	width: 100%;
}

.form__fields{
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.field{
	display: flex;
	flex-direction: row;
	gap: 10px;
	align-items: center;
}

.field > ion-button {
	--background: var(--ion-color-step-150);
}

.helpers-enter-active{
	animation: helpers .5s;	
	overflow: hidden;
}
.helpers-leave-active{
	animation: helpers .5s reverse;	
	overflow: hidden;
}

@keyframes helpers {
	0% {
		height: 27.3px;
	}

	100% {
		height: 283.3px;
	}
}

.fade-enter-active {
	animation: fade .3s;
}

.fade-leave-active {
	animation: fade .3s reverse;
}

@keyframes fade {
	from { 
		opacity: 0;
		height:  0;
	}
	to { 
		opacity: 1;
		height: 20px;
	}
}
.fade__button-enter-active {
	animation: fade__button .3s;
}

@keyframes fade__button {
	from { 
		opacity: 0;
		height:  0;
	}
	to { 
		opacity: 1;
		height: 35.3px;
	}
}

.car-enter-active {
	animation: car_inner .5s;
	overflow: hidden;
}
.car-leave-active{
	animation: car_outer .5s reverse;	
	overflow: hidden;
}

@keyframes car_inner {
	0% {
		height: 27.3px;
	}

	100% {
		height: 217.3px;
	}
}

@keyframes car_outer {
	0% {
		height: 27.3px;
	}

	100% {
		height: 217.3px;
	}
}
</style>