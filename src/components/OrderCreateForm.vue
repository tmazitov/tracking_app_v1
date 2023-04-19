<template>
	<div class="order_create_form">
		<div class="form">
			<div class="form__tabs" v-if="data.isNeededTabs">
				<div class="form__tab" @click="() => selectTab(0)" v-bind:class="{
					selected: form.selectedTab == 0,
				}">Инфо</div>
				<div class="form__tab" @click="() => selectTab(1)" v-bind:class="{
					selected: form.selectedTab == 1,
				}">Точки - {{form.points.length}}</div>
			</div>
			

			<div class="form__tabs-content">
				<div class="form__page-1" v-if="form.selectedTab == 0 || !data.isNeededTabs">
					
					<div class="form__datetime-title">
						<!-- Datetime -->

						<div class="form__date-time-container">
							<ion-input type="date" v-model="form.date" label="Дата" label-placement="floating" fill="solid">
							</ion-input>
							<ion-input type="time" v-model="form.time" label="Время" label-placement="floating" fill="solid">
							</ion-input>
						</div>

						<!-- Title -->
		
						<div class="form__title-container">
							<ion-input type="text" v-model="form.title" label="Название заказа" fill="solid" label-placement="floating" placeholder="По умолчанию адрес первой точки">
							</ion-input>
						</div>

					</div>
	
					<div v-if="!data.isNeededTabs">
						<OrderPointsMap v-model:points="form.points" />
					</div>

					<!-- Comment -->
	
					<div class="form__comment-container">
						<ion-textarea label="Комментарий заказа" labelPlacement="floating" fill="solid" v-model="form.comment">
						</ion-textarea>
					</div>

					<div class="form__helpers">
						<ion-input type="text" v-model="form.helpers" label="Грузчики" fill="solid" label-placement="floating">
						</ion-input>

						<div class="ion-activatable ripple-parent form__helpers-button"  @click="addHelper">
							<ion-icon :icon="add"></ion-icon>
							<ion-ripple-effect></ion-ripple-effect>
						</div>
						<div class="ion-activatable ripple-parent form__helpers-button" @click="removeHelper">
							<ion-icon :icon="remove" ></ion-icon>
							<ion-ripple-effect></ion-ripple-effect>
						</div>
					</div>
	
					<div class="from__order-type-worker">
						<!-- Worker -->
					
						<RSelector 
							v-model:current-item="form.currentWorkerId"
							:items="workers" 
							:selector="selectWorker"
							:label="'Водитель'"
						/>

						<!-- Order type -->

						<RSelector
							v-model:current-item="form.currentOrderType"
							:items="orderTypes" 
							:selector="selectOrderType"
							:label="'Тип заказа'"
							:multiple="true"
						/>
					
					</div>
					



					<!-- Is Fragile cargo -->

					<ion-checkbox labelPlacement="end" v-model="form.isFragileCargo">Упаковка груза защитной плёнкой</ion-checkbox>

					<!-- Is Fragile cargo -->

					<ion-checkbox labelPlacement="end" v-model="form.isRegularCustomer">Постоянный клиент</ion-checkbox>

					<!-- Make the table of worker business -->
					<div class="form__submit-container">
						<ion-button @click="orderSubmit">Создать</ion-button>
					</div>
				</div>
				<div class="form__page-2" v-if="form.selectedTab == 1">
					<OrderPointsMap v-model:points="form.points" />
				</div> 
			</div>

		</div>
	</div>
</template>

<script lang="ts">
import OrderPointsMap from "./OrderPointsMap.vue";
import { IonTitle, IonIcon, IonInput, IonSelect, IonSelectOption, IonTextarea, IonCheckbox, IonButton, useIonRouter } from "@ionic/vue";
import { add, arrowBackOutline, remove } from "ionicons/icons";
import { ComputedRef, computed, reactive, toRaw, toRef } from "vue";
import User from "@/assets/user";
import RSelector from './inputs/RSelector.vue'
import { IonSelectCustomEvent } from "@ionic/core";
import Point from "@/assets/point";
import SelectableItem from "@/assets/selectableItem";
import TMS from "@/api/tms";
import { UTCString } from "@/assets/data";
import { cssVw } from "@/assets/standardDimensions";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

interface CreateForm {
	title: string
	date: string
	time: string

	helpers: number
	comment: string

	points: Array<Point>
	selectedTab: number
	currentWorkerId:number
	currentOrderType:Array<number>

	isFragileCargo: boolean
	isRegularCustomer:boolean
}

interface SelectorsData {
	workers: ComputedRef<Array<User>>
	orderTypes: Array<SelectableItem>
}

export default {
	name: "OrderCreateForm",
	components: {
		OrderPointsMap,
		IonTitle,
		IonInput,
		IonTextarea,
		IonIcon,
		IonCheckbox,
		RSelector,
		IonButton,
		IonSelect, IonSelectOption
	},

	setup(props) {
		const store = useStore()
		const router = useRouter()
		const form = reactive<CreateForm>({
			title: "",
			date: "",
			time: "",
			helpers: 0,
			comment: "",
			points: [],
			selectedTab: 0,
			currentWorkerId: 0,
			currentOrderType: [1],
			isFragileCargo: false,
			isRegularCustomer:false
		});

		const data = reactive({
			isNeededTabs: cssVw*100 <= 480,
		})


		const workers = computed(() => store.getters.staffWorkers)
		const selectWorker = (workerId:number) => {
			form.currentWorkerId = workerId
		}

		const selectOrderType = (orderType:Array<number>) => {
			form.currentOrderType = orderType
		}

		const orderTypes =  [
			{value: 1, title: "Город"},
			{value: 2, title: "Пригород"},
			{value: 3, title: "Меж. город"},
		]
	

		const orderSubmit = () => {

			let date = new Date(form.date + " " + form.time)
			TMS.order().create({
				title: form.title,
				startAt: UTCString(date),
				points: form.points,
				workerId: form.currentWorkerId,
				helpers: form.helpers,
				orderType: form.currentOrderType.reduce((a, b) => a + b),
				comment: form.comment,
				isFragileCargo: form.isFragileCargo,
				isRegularCustomer: form.isRegularCustomer,
			}).then(response => {
				console.log('response :>> ', response);
				if (response.data["err"]){
					throw new Error(response.data["err"])
				}
				router.push({name:"home"})
			})
		}

		const selectTab = (index: number) => (form.selectedTab = index);

		const addHelper = () => form.helpers += 1
		const removeHelper = () => {if (form.helpers > 0) { form.helpers -= 1}}

		return {
			addHelper,
			removeHelper,
			data,
			remove,
			add,
			form,
			workers,
			orderTypes,
			selectTab,
			orderSubmit,
			selectWorker,
			selectOrderType,
			arrowBackOutline,
		};
	},
};
</script>

<style scoped>
@import url(../theme/variables.css);

.form {
	height: 100%;
	width: 100%;
	min-width: 350px;
	max-width: 640px;

	border-radius: 8px;

	display: flex;
	flex-direction: column;
	gap: 16px;

	padding: 10px 20px;
}

@media (max-width: 768px){
	.form {
		width: 100vw;
		height: calc(100vh - 113px);
		border-radius: 0;
		padding: 10px;
	}
	.form__tabs-content{
		height: calc(100% - 98px);
	}

	.form__datetime-title{
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.from__order-type-worker{
		display: flex;
		flex-direction: column;
		gap: 16px;
	}	
}

@media (min-width: 768px) {
	.form {
		height: calc(100vh - 56px);
		width: 60vw;
	}
	.form__tabs-content{
		height: 100%;
	}

	.form__datetime-title{
		display: grid;
		grid-template-columns: auto auto;
		grid-column-gap: 16px;
	}

	.from__order-type-worker{
		display: grid;
		grid-template-columns: calc(50% - 8px) calc(50% - 8px);
		grid-column-gap: 16px;
	}
}



.form > * {
	width: 100%;
}

@keyframes open-form {
	from {
		opacity: 0;
		height: calc(100vh - 112px);
	}

	to {
		height: calc(100vh - 56px);
		opacity: 1;
	}
}

@keyframes close-form {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

.title {
	font-size: 20px;
	font-weight: 600;
	padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.form__date-time-container {
	display: flex;
	flex-direction: row;
	gap: 16px;
}

.form__tabs {
	display: grid;
	grid-template-columns: 50% 50%;
	height: 32px;
	width: 100%;

	border: 1px solid var(--ion-color-step-300);
	border-radius: 4px;
}

.form__tab {
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	border-radius: 4px;
}

.form__tab:hover {
	background: var(--ion-color-step-100);
}

.form__tab.selected {
	background: var(--ion-color-primary);
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
	border: 2px solid #6815ec;
}

ion-checkbox{
	width: fit-content;
}

.form__submit-container{
	margin-top: 20px;	
	display: flex;
	justify-content: center;
	padding: 0 20px;
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
</style>
