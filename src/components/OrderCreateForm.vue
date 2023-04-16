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
	
					<div class="from__order-type-worker">
						<!-- Worker -->
					
						<RSelector 
							v-model:current-item="form.currentWorkerId"
							:items="selectorsData.workers.map(w => w.toSelectableItem())" 
							:selector="selectWorker"
							:label="'Водитель'"
						/>

						<!-- Order type -->

						<RSelector
							v-model:current-item="form.currentOrderType"
							:items="selectorsData.orderTypes" 
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
import { arrowBackOutline } from "ionicons/icons";
import { reactive } from "vue";
import User from "@/assets/user";
import RSelector from './inputs/RSelector.vue'
import { IonSelectCustomEvent } from "@ionic/core";
import Point from "@/assets/point";
import SelectableItem from "@/assets/selectableItem";
import TMS from "@/api/tms";
import { UTCString } from "@/assets/data";
import { cssVw } from "@/assets/standardDimensions";
import { useRouter } from "vue-router";

interface CreateForm {
	title: string
	date: string
	time: string

	comment: string

	points: Array<Point>
	selectedTab: number
	currentWorkerId:number
	currentOrderType:Array<number>

	isFragileCargo: boolean
	isRegularCustomer:boolean
}

interface SelectorsData {
	workers: Array<User>
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
		const router = useRouter()
		const form = reactive<CreateForm>({
			title: "",
			date: "",
			time: "",
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

		const selectorsData = reactive<SelectorsData>({
			workers: [
				new User(0, "Нет", 1),
				new User(1, "Тимур", 1),
				new User(2, "Саша", 1),
				new User(3, "Матвей", 1),
				new User(4, "Эдик", 1)
			],
			orderTypes: [
				{value: 1, title: "Город"},
				{value: 2, title: "Пригород"},
				{value: 3, title: "Меж. город"},
			]
		})

		const selectWorker = (workerId:number) => {
			form.currentWorkerId = workerId
		}

		const selectOrderType = (orderType:Array<number>) => {
			form.currentOrderType = orderType
		}
		
		const compareWith = (o1:User, o2:User) => {
			return o1 && o2 ? o1.id === o2.id : o1 === o2;
		}

		const orderSubmit = () => {

			let date = new Date(form.date + " " + form.time)
			TMS.order().create({
				title: form.title,
				startAt: UTCString(date),
				points: form.points,
				workerId: 7,
				helpers: 0,
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

		return {
			data,
			form,
			selectorsData,
			selectTab,
			compareWith,
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
	height: calc(100vh - 112px);
	width: 45vw;
	min-width: 350px;
	max-width: 640px;

	border-radius: 8px;
	padding: 20px;

	display: flex;
	flex-direction: column;
	gap: 16px;
}

@media (max-width: 480px){
	.form {
		width: 100vw;
		height: calc(100vh - 56px);
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

@media (min-width: 480px) {
	.form {
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
	grid-template-columns: auto auto;
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
</style>
