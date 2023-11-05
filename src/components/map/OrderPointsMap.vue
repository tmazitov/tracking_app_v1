<template>
	<div class="order-map">
		<div class="order-map__map-container">
			<div id="map"></div>
		</div>
		<div class="order-map__way-values">
			<div v-if="map.totalDistance">{{ toKM(map.totalDistance.value) }}</div>
			<div v-if="map.totalTime">{{ toTimeString(map.totalTime.value) }}</div>
		</div>
		<div class="order-map__search-field" v-if="!readonly">
			<RAddressInput 
				:addPointFunc="data.pointToUpdate? updatePoint : createPoint"
				:closeFunc="data.pointToUpdate? disableUpdatePointMode : undefined"
				:pointToUpdate="data.pointToUpdate"/>
		</div>

		<div class="order-map__points">
			<ion-reorder-group :disabled="readonly" @ionItemReorder="(ev) => pointsManager.reorderPoints(ev)">
				<ion-item class="order-map__point-item "  
				v-for="point, index in map.points.value"
				:key="`order_point_${index}`">
					<ion-reorder slot="start"></ion-reorder>
					<ion-label>{{ point.title }}</ion-label>
					<ion-icon v-if="!readonly" @click="(ev) => pointsManager.openPopover(ev, point)" :icon="ellipsisHorizontal" slot="end"
						class="detail-icon"></ion-icon>
					<ion-popover v-if="!readonly" side="top" alignment="end" 
						:is-open="point.detailsIsOpen" :event="point.detailsEvent"
						@didDismiss="() => pointsManager.closePopover(point)">
						<ion-content class="order-point-detail__selector">
							<ion-list>
								<ion-item class="popover-header">
									<ion-label>{{ point.title }}</ion-label>
								</ion-item>
								<ion-item :button="true" :detail="false"
									@click="() => enableUpdatePointMode(point)">
									Изменить
								</ion-item>
								<ion-item :button="true" :detail="false"
									@click="() => { pointsManager.makePointClone(point) }">
									Создать копию
								</ion-item>
								<ion-item :button="true" :detail="false" @click="() => { pointsManager.focusPoint(point) }">
									Найти на карте
								</ion-item>
								<ion-item :button="true" :detail="false" @click="() => { pointsManager.removePoint(point) }"
									class="delete-button">
									Удалить
								</ion-item>
							</ion-list>
						</ion-content>
					</ion-popover>
				</ion-item>
			</ion-reorder-group>
		</div>
	</div>
</template>

<script lang="ts">
import OrderPointsMap from '@/assets/map'
import { IonReorderGroup, IonItem, IonLabel, IonReorder, IonInput, IonIcon, IonContent, IonPopover, IonList } from '@ionic/vue'
import { Transition, computed } from 'vue'
import { toKM, toTimeString, convertSeconds } from '@/assets/standardDimensions'
import SearchSelector from '../inputs/RSearchSelector.vue'
import { reactive, onMounted, watch } from 'vue'
import { ellipsisHorizontal } from 'ionicons/icons'
import Point from '@/assets/point'

import "leaflet/dist/leaflet.css";
import * as GeoSearch from 'leaflet-geosearch';
import { LatLngTuple } from 'leaflet'
import PointsManager from '@/assets/map/pointsManager'
import RAddressInput from '../inputs/RAddressInput.vue'

export default {
	name: 'OrderPointsMap',
	components: {
		RAddressInput,
		IonReorderGroup, IonItem, IonLabel, IonReorder, IonInput, IonIcon, Transition, SearchSelector, IonPopover, IonContent, IonList,
	},
	emits:[
		'update:wayHours', 
		'update:kmCount',
		'update:points',
	],
	props: {
		points: {
			type: Array<Point>,
			required: true,
		},
		wayHours: {
			type: Number,
		},
		kmCount: {
			type: Number,
		},
		readonly: {
			type: Boolean,
			default: false,
		}
	},
	setup(props, ctx) {
		let map = new OrderPointsMap()
		let pointsManager = new PointsManager(map)
		const data = reactive<{
			pointToUpdate: Point|undefined,

		}>({
			pointToUpdate: undefined,
		})

		onMounted(() => {
			setTimeout(() => {
				let initZoom: number = 11
				let initCenter: LatLngTuple = [55.7887, 49.1221]
				map.setup(initCenter, initZoom, props.points)
			}, 100)
		})


		const createPointHandler = (point: Point) => {
			if (point.title == "") return

			map.addPoint(point)
		}

		const disableUpdatePointMode = () => {
			data.pointToUpdate = undefined
		}

		const updatePointHandler = (payload: Point) => {
			let point:Point|undefined = data.pointToUpdate
			if (!point) return

			map.updatePoint(point, payload)
			// point.searchQuery = .searchField
			disableUpdatePointMode()
		}

		const enableUpdatePointMode = (point: Point) => {
			data.pointToUpdate = point
			// data.searchField = point.searchQuery ?? point.title	
			pointsManager.closePopover(point)
		}



		watch(() => map.points.value , (newValue) => {
			if (props.readonly)
				return
			ctx.emit('update:points', newValue)
		})

		watch(() => map.totalTime.value, (newValue) => {
			let time = convertSeconds(newValue)
			let totalHours = time.hours + time.days * 24 + time.minutes/60
			if (totalHours < 2) {
				totalHours = 2
			} else {
				totalHours = Math.ceil(totalHours)
			} 
			console.log('newTotalTime :>> ', newValue);
			ctx.emit('update:wayHours', totalHours)
		})

		watch(() => map.totalDistance.value, (newValue) => {
			let kmCount = Math.round(newValue / 1000)
			ctx.emit('update:kmCount', kmCount)
		})

		return {
			toKM, toTimeString,
			createPoint: createPointHandler,
			pointsManager,
			// searchLocation: searchLocationHandler,
			ellipsisHorizontal,
			map,
			data,
			open,
			updatePoint: updatePointHandler,
			enableUpdatePointMode,
			disableUpdatePointMode,
			readonly: props.readonly,
		}
	}
}
</script>

<style scoped>
@import url(../../theme/variables.css);

.order-map {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

div.leaflet-top.leaflet-right {
	display: none !important;
	width: 0px !important;
	height: 0px !important;
}

.leaflet-touch .leaflet-control-attribution,
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
	display: none;
}

.leaflet-control {
	display: none;
}


@media (max-width: 768px) {
	.order-map__map-container {
		height: 250px;
	}
}

@media (min-width: 768px) {
	.order-map__map-container {
		height: 400px;
	}
}

#map {
	height: 100%;
	width: 100%;
}

.order-map__points {
	height: fit-content;
	max-height: 192px;
	overflow-y: auto;
	border: 1px solid var(--ion-color-step-100);
}

.order-map__way-values {
	display: flex;
	flex-direction: row;
	gap: 16px;
}

.detail-icon {
	color: var(--ion-color-step-350);
}

.order-point-detail__selector {
	display: flex;
	flex-direction: column;
}

ion-item.delete-button::part(native) {
	color: red;
}

.popover-header {
	border-bottom: 1px solid var(--ion-color-step-300);
}

.order-map__revert-point-changes{
	margin-top: 10px;
	display: flex;
	justify-content: end;
	text-decoration: underline;
	color: var(--ion-color-primary);
}
</style>