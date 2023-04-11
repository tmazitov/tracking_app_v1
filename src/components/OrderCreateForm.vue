<template>
	<div class="order_create_form">
		<div class="form__container">
			<div class="form-container__title-container">
				<div class="closer" @click="() => {close()}">
					<ion-icon size="large" :icon="arrowBackOutline"></ion-icon>
				</div>
				<ion-title class="large">Новый заказ</ion-title>
			</div>
			<div class="form__map-container">
				<div id="map"></div>

			</div>
			<div class="form__map-way-values">
				<div v-if="map.totalDistance" >{{toKM(map.totalDistance.value)}}</div>
				<div v-if="map.totalTime">{{toTimeString(map.totalTime.value)}}</div>
			</div>
			<div class="form__search-field">
				<ion-input 
					v-model="data.searchField" 
					label-placement="floating"
					fill="solid" 
					:clear-input="true"
					label="Введите адрес"
					@ion-input="searchLocation"
					@ion-focus="()=>{data.searchResultsIsOpen=true}"
					@ion-blur="()=>{data.searchResultsIsOpen=false}">
				</ion-input>
				<transition name="search">
					<div class="search-field__items" v-if="data.searchField != '' && data.searchResultsIsOpen">
						<div v-if="data.searchResults.length != 0">
							<div class="search-field__item" 
								v-for="searchedPoint, index in data.searchResults" 
								:key="`searched_point_${index}`"
								@click="() => createPoint(searchedPoint)">
								{{ searchedPoint.title }}
							</div>
						</div>
						<div v-else class="search-field__empty">
							Подходящие адресса не найдены
						</div>
					</div>
				</transition>
			</div>

			<div class="form__points">
				<ion-reorder-group  :disabled="false" @ionItemReorder="reorderPoints">
					<ion-item v-for="point,key in map.points.value" :key="`order_point_${key}`">
						<ion-label>{{point.title}}</ion-label>
						<ion-reorder slot="end"></ion-reorder>
					</ion-item>
				</ion-reorder-group>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { IonBackdrop, IonButton, IonInput, IonTitle, IonIcon, IonReorderGroup, IonReorder, IonItem, IonLabel, ItemReorderEventDetail } from '@ionic/vue';
import { computed, Transition } from 'vue';
import { arrowBackOutline } from 'ionicons/icons';
import { onMounted, reactive } from 'vue';

import L from 'leaflet'
import OrderPointsMap from '../assets/map'
import "leaflet/dist/leaflet.css";
import * as GeoSearch from 'leaflet-geosearch';
import Point from '@/assets/point';

import {toKM, toTimeString} from '@/assets/standardDimensions'

export default {
	name: 'OrderCreateForm',
	components: {
		IonBackdrop,
		IonButton,
		IonTitle,
		IonIcon,
		IonInput,
		IonReorder,
		IonReorderGroup,
		IonItem,
		IonLabel,
		Transition,
	},
	props: {
		closer: {
			type: Function,
			required: true,
		}
	},
	setup(props) {

		const map = new OrderPointsMap()
		const data = reactive<{
			isOpen: boolean,

			searchLastDate: Date|null,
			searchField: string,
			searchResults: Point[],
			searchResultsIsOpen: boolean,
		}>({
			isOpen: false,

			searchLastDate: null,
			searchField: "",
			searchResults: [],
			searchResultsIsOpen: false,
		})

		onMounted(() => {
			map.setup([55.7887, 49.1221], 5)
		})

		const provider = new GeoSearch.OpenStreetMapProvider();
		const searchLocationHandler = async (ev:CustomEvent) => {
			data.searchResultsIsOpen = true
			if (ev.detail["value"] == ""){
				data.searchResults = []
				return
			}

			data.searchLastDate = new Date()
			setTimeout(async () => {
				if (!data.searchLastDate) return
				if ((new Date()).getTime() - data.searchLastDate.getTime() < 500) return

				const results = await provider.search({ query: data.searchField });
				data.searchResults = []
				results.forEach(point => {
					let x: number = point.x
					let y: number = point.y
					let label: string = point.label
					data.searchResults.push(new Point({ x, y, label }))
				})
			},1000)
			
		}

		const createPoint = (point: Point) => {
			if (point.title == "") return
			map.addPoint(point)
			data.searchField = ""
		}

		const reorderPointsHandler = (ev:CustomEvent<ItemReorderEventDetail>) => {
			map.points.value = ev.detail.complete(map.points.value)
			map.replacePoints(ev.detail.from, ev.detail.to)
		}


		return {
			toKM, toTimeString,
			reorderPoints: reorderPointsHandler,
			searchLocation: searchLocationHandler,
			close: props.closer,
			map: map,
			data,
			open,
			createPoint,
			arrowBackOutline,
		}
	}
}
</script>

<style scoped>

@import url(../theme/variables.css);
.order_create_form {
	width: 100vw;
	z-index: 12;
	display: flex;
	justify-content: center;
	position: relative;
}
div.leaflet-top.leaflet-right{ display: none !important; width: 0px  !important; height: 0px  !important; }
.leaflet-touch .leaflet-control-attribution, .leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {
	display: none;
  }
.leaflet-control{
	display: none;
}

.form__container {
	margin: 10px;
	height: calc(100vh - 113px);
	position: absolute;
	width: 450px;
	background: #323232;
	margin: 0 auto;

	border-radius: 8px;
	padding: 25px;

	display: flex;
	flex-direction: column;
	gap: 16px;
}

ion-title.large {
	font-size: 28px;
	padding: 0;
	text-align: center;
}

.form-container__title-container {
	display: grid;
	grid-template-columns: 28px calc(100% - 28px - 32px - 28px) 28px;
	grid-column-gap: 16px;
}

.form__map-container {
	height: 300px;
}

#map {
	height: 100%;
	width: 100%;
}

.form__search-field{
	position: relative;

}

.search-field__items{
	z-index: 4;
	position: absolute;
	bottom: -200px;
	height: 200px;
	width: 100%;
	overflow-y: auto;
	border-top: none;
	border-radius: 0 0 4px 4px;
	background: var(--ion-color-step-150);
}

.search-field__item{
	padding: 16px;
	cursor: pointer;
}

.search-field__item:hover{
	background: var(--ion-color-step-50);
}

.search-field__item:not(:last-child){
	border-bottom: 1px solid var(--ion-color-step-200);
}

.search-field__empty{
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--ion-color-step-500);
}

.search-enter-active{
	animation: search-items .2s;
}

.search-leave-active{
	animation: search-items .2s reverse;
}

@keyframes search-items{
	from {
		bottom: 0;
		height: 0;
	}
	to {
		bottom: -200px;
		height: 200px;
	}
}
</style>