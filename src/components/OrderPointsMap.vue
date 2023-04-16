<template>
	<div class="order-map">
		<div class="order-map__map-container">
			<div id="map"></div>
		</div>
		<div class="order-map__way-values">
			<div v-if="map.totalDistance">{{ toKM(map.totalDistance.value) }}</div>
			<div v-if="map.totalTime">{{ toTimeString(map.totalTime.value) }}</div>
		</div>
		<div class="order-map__search-field">
			<SearchSelector
				:label="'Введите адресс'"
				:items="data.searchResults"
				:selector="createPoint"
				:searchFunction="searchLocation"
			/>
		</div>

		<div class="order-map__points">
			<ion-reorder-group :disabled="false" @ionItemReorder="reorderPoints">
				<ion-item v-for="point, key in map.points.value" :key="`order_point_${key}`">
					<ion-label>{{ point.title }}</ion-label>
					<ion-reorder slot="end"></ion-reorder>
				</ion-item>
			</ion-reorder-group>
		</div>
	</div>
</template>

<script lang="ts">
import OrderPointsMap from '@/assets/map'
import { IonReorderGroup, IonItem, IonLabel, IonReorder, IonInput } from '@ionic/vue'
import { Transition } from 'vue'
import { toKM, toTimeString } from '@/assets/standardDimensions'
import { ItemReorderEventDetail } from '@ionic/core'
import SearchSelector from './inputs/RSearchSelector.vue'
import { reactive, onMounted } from 'vue'
import Point from '@/assets/point'

import "leaflet/dist/leaflet.css";
import * as GeoSearch from 'leaflet-geosearch';

export default {
	name: 'OrderPointsMap',
	components: {
		IonReorderGroup, IonItem, IonLabel, IonReorder, IonInput, Transition, SearchSelector,
	},
	props:{
		points: {
			type: Array<Point>,
			required: true,
		}
	},
	setup(props) {
		let map = new OrderPointsMap()
		const data = reactive<{
			isOpen: boolean,

			searchField: string,
			searchLastDate: Date | null,
			searchResults: Point[],
		}>({
			isOpen: false,

			searchField: "",
			searchLastDate: null,
			searchResults: [],
		})

		onMounted(() => {
			setTimeout(() => {
				map.setup([55.7887, 49.1221], 5, props.points)
			},100)
		})

		const provider = new GeoSearch.OpenStreetMapProvider();
		const searchLocationHandler = async (ev: CustomEvent) => {
			data.searchField = ev.detail.value
			if (ev.detail["value"] == "") {
				data.searchResults = []
				return
			}

			data.searchLastDate = new Date()
			setTimeout(async () => {
				if (!data.searchLastDate) return
				// Delay before sending request 
				if ((new Date()).getTime() - data.searchLastDate.getTime() < 500) return

				const results = await provider.search({ query: data.searchField });
				data.searchResults = []
				results.forEach(point => {
					let x: number = point.x
					let y: number = point.y
					let label: string = point.label
					data.searchResults.push(new Point({ x, y, label }))
				})
			}, 1000)
		}

		const createPointHandler = (point: Point) => {
			if (point.title == "") return
			map.addPoint(point)
			data.searchField = ""
			// props.points.push(point)
		}

		const reorderPointsHandler = (ev: CustomEvent<ItemReorderEventDetail>) => {
			map.points.value = ev.detail.complete(map.points.value)
			map.replacePoints(ev.detail.from, ev.detail.to)
		}


		return {
			toKM, toTimeString,
			createPoint: createPointHandler,
			reorderPoints: reorderPointsHandler,
			searchLocation: searchLocationHandler,
			map,
			data,
			open,
		}
	}
}
</script>

<style scoped>

	@import url(../theme/variables.css);

	.order-map{
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	div.leaflet-top.leaflet-right{ display: none !important; width: 0px  !important; height: 0px  !important; }
	.leaflet-touch .leaflet-control-attribution, .leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {
		display: none;
	}
	.leaflet-control{
		display: none;
	}
	.order-map__map-container {
		height: 400px;
	}

	#map {
		height: 100%;
		width: 100%;
	}

	.order-map__search-field{
		position: relative;
	}

	.order-map__points{
		height: fit-content;
		max-height: 240px;
		overflow-y: auto;
		border: 1px solid var(--ion-color-step-100);
	}

	.order-map__way-values{
		display: flex;
		flex-direction: row;
		gap: 16px;
	}

</style>