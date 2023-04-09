<template>
	<div class="order_create_form">
		<div class="form__container">
			<div class="form-container__title-container">
				<div class="closer" v-bind:click="close">
					<ion-icon size="large" :icon="arrowBackOutline"></ion-icon>
				</div>
				<ion-title class="large">Новый заказ</ion-title>
			</div>
			<div class="form__map-container">
				<div id="map"></div>

			</div>
			<ion-input v-model="data.searchField" label-placement="floating" fill="solid" label="Введите адрес"
				@input="searchLocation"></ion-input>
			<div v-for="searchedPoint, index in data.searchResults" :key="`searched_point_${index}`" @click="() => createPoint(searchedPoint)">
				{{ searchedPoint.title }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { IonBackdrop, IonButton, IonInput, IonTitle, IonIcon } from '@ionic/vue';

import { arrowBackOutline } from 'ionicons/icons';
import { onMounted, reactive } from 'vue';

import LMap from '../assets/map'
import "leaflet/dist/leaflet.css";
import L from 'leaflet'
import * as GeoSearch from 'leaflet-geosearch';
import Point from '@/assets/map/point';

export default {
	name: 'OrderCreateForm',
	components: {
		IonBackdrop,
		IonButton,
		IonTitle,
		IonIcon,
		IonInput,
	},
	props: {
		closer: {
			type: Function,
			required: true,
		}
	},
	setup(props) {
		const data = reactive<{ 
			isOpen: boolean,
			map: LMap,
			searchField: string,
			searchResults: Point[],
		}>({
			isOpen: false,
			map: new LMap(),
			searchField: "",
			searchResults: [],
		})	

		onMounted(() => {
			data.map.setup([55.7887, 49.1221],5)
		})

		const provider = new GeoSearch.OpenStreetMapProvider();
		const searchLocation = async () => {
			const results = await provider.search({ query: data.searchField });
			data.searchResults = []
			results.forEach(point => {
				data.searchResults.push(new Point(point.label,point.x,point.y))
			})
		}

		const createPoint = (point:Point) => {
			data.map.addPoint(point)
		} 

		return {
			searchLocation,
			close: props.closer,
			data,
			open,
			createPoint,
			arrowBackOutline,
		}
	}
}
</script>

<style scoped>
.order_create_form {
	width: 100vw;
	z-index: 12;
	display: flex;
	justify-content: center;
	position: relative;
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
</style>