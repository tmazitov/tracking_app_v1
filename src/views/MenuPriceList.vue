<template>
	<ion-page>
		<ion-content>
			<div class="menu-default-prices" v-if="data.priceList">
				<ion-card>
					<ion-card-header>
						<ion-card-title>Машина</ion-card-title>
						<ion-card-subtitle>
							Переменные для работы с машинами
						</ion-card-subtitle>
					</ion-card-header>
					<ion-card-content class="card-content">
						<RNumberInput inputType="hour"
						label="Часы по умолчанию" v-model:value="data.priceList.bigCarTime"  :step="1" :min="0" :max="24"/>
						<RNumberInput inputType="price"
						label="Стоимость за час" v-model:value="data.priceList.bigCarPrice"  :step="50" :min="0" :max="10000"/>
					</ion-card-content>
				</ion-card>
				<ion-card>
					<ion-card-header>
						<ion-card-title>Грузчики</ion-card-title>
						<ion-card-subtitle>
							Переменные для работы с грузчиками
						</ion-card-subtitle>
					</ion-card-header>
					<ion-card-content class="card-content">
						<RNumberInput inputType="hour"
						label="Часы по умолчанию" v-model:value="data.priceList.helperTime"  :step="1" :min="0" :max="24"/>
						<RNumberInput inputType="price"
						label="Стоимость за час" v-model:value="data.priceList.helperPrice"  :step="50" :min="0" :max="10000"/>
					</ion-card-content>
				</ion-card>
				<ion-card>
					<ion-card-header>
						<ion-card-title>Прочее</ion-card-title>
					</ion-card-header>
					<ion-card-content class="card-content">
						<RNumberInput inputType="price"
						label="Стоимость упаковки" v-model:value="data.priceList.fragilePrice"  :step="50" :min="0" :max="10000"/>
						<RNumberInput inputType="price"
						label="Стоимость 1 км" v-model:value="data.priceList.kmPrice"  :step="1" :min="0" :max="10000"/>
					</ion-card-content>
				</ion-card>
				<div class="button-container" v-if="data.priceListIsChanged">
					<ion-button @click="submit">Сохранить</ion-button>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonInput, onIonViewDidEnter, IonButton } from '@ionic/vue';
import { computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import RNumberInput from '@/components/inputs/RNumberInput.vue';
import TMS from '@/api/tms';
import OrderPriceList from '@/assets/orderPriceList';
import { AdminAPI } from '@/api/admin';
import Order from '@/assets/order';

export default {
	name: "MenuDefaultPrices",
	components: {
		IonPage,
		IonCard,
		IonInput,
		IonItem,
		IonButton,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent,
		IonContent,
		RNumberInput,
	},
	setup(){
		const store = useStore()
		const user = computed(() => {
			store.getters.userMainInfo
		})

		const data = reactive<{
			priceListIsChanged: boolean,
			priceList: OrderPriceList|null,
			originPriceList: OrderPriceList|null,
		}>({
			priceList: null,
			priceListIsChanged: false,
			originPriceList: null,
		})

		onIonViewDidEnter(() => {
			TMS.order().priceList().then(response => {
				if (!response.data) return
				if (response.data.err) throw response.data.err

				data.priceList = new OrderPriceList(response.data)
				data.originPriceList = new OrderPriceList(response.data)
			})
		})

		const submit = () => {
			if (!data.priceList) return
			AdminAPI.updatePriceList(data.priceList).then(() => {
				if (!data.priceList) return
				data.originPriceList = data.priceList.clone()
				data.priceListIsChanged = false
			})
		}

		watch(() => data.priceList, (priceList) => {
			if (!data.originPriceList) return
			if (!priceList) return

			let isEqual:boolean = data.originPriceList.compare(priceList)
			data.priceListIsChanged = !isEqual
		},{deep:true})

		return {
			data,
			submit,
		}
	}
}
</script>

<style scoped>
.card-content{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.menu-default-prices{
	margin-bottom: 70px;
}

.button-container{
	position: fixed;
	bottom: 10px;
	right: 10px;
	left: 10px;
}

.button-container > ion-button {
	width: 100%;
}

</style>