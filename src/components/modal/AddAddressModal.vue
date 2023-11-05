<template>
	<div class="add_address_modal">
		<transition name="show__backdrop">
			<div class="backdrop" v-if="isOpen && data.localeIsOpen" @click="closeHandler">
			</div>
		</transition>
		<transition name="show__content">
			<div class="modal_content" v-if="isOpen && data.localeIsOpen" ref="modalContent">
				<div class="modal_header">
					<div class="close_button" @click="closeHandler">
						<ion-icon :icon="arrowBackOutline"></ion-icon>
					</div>
					{{ pointToUpdate ? 'Изменить точку' : 'Добавить точку'}}
				</div>
				<ion-input v-model="data.searchString"
					id="search" ref="searchField"
					label-placement="floating" fill="solid"
					label="Введите адрес" 
					@ion-input="searchHandler">
				</ion-input>
				<ion-list v-if="data.searchResults.length > 0">
					<ion-item @click="() => selectHandler(searchItem)"
						v-for="searchItem, index in data.searchResults"
						:key="`search-item-${index}`">
						<ion-label>{{ searchItem.title }}</ion-label>
					</ion-item>
				</ion-list>
				<div v-if="data.searchResults.length == 0 && 
								data.searchString.length != 0">
					<ion-text >
						Адресс не найден
					</ion-text>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { reactive, computed, ref, toRaw, Component, getCurrentInstance, onUpdated, onMounted } from 'vue';
import { IonInput, IonItem, IonLabel, IonList, IonTitle, IonIcon, IonText,  } from '@ionic/vue';
import Point from '@/assets/point';
import * as GeoSearch from 'leaflet-geosearch';
import { useStore } from 'vuex';
import { closeOutline, arrowBackOutline } from 'ionicons/icons';

export default {
	name: 'AddAddressModal',
	components: {
		IonInput,
		IonList,
		IonItem,
		IonLabel,
		IonText,
		IonIcon,
		IonTitle,
	},
	props: {
		addPointFunc: {
			type: Function,
			required: true,
		},
		pointToUpdate: {
			type: Point,
		},
		closeFunc: {
			type: Function,
		},
		isOpen: {
			type: Boolean,
			required: true,
		}
	},
	setup(props, ctx) {
		const data = reactive<{
			localeIsOpen: boolean,
			searchString: string,
			searchResults: Array<Point>,
			searchLastDate: Date | null,
		}>({
			localeIsOpen: true,
			searchString: "",
			searchResults: [],
			searchLastDate: null
		})

		const addPointFunc = computed(() => props.addPointFunc)
		const closeFunc = computed(() => props.closeFunc)
		const pointToUpdate = computed(() => props.pointToUpdate)
		const modalContent = ref<any>(null)
		const searchField = ref<{$el:any}|null>(null)
		const isOpen = computed(() => props.isOpen)

		
		onUpdated(() => {
			if (isOpen.value && searchField.value){
				setTimeout(() => {
					if (searchField.value)
						searchField.value.$el.setFocus()
				}, 650)
			}
			if (pointToUpdate.value)
				data.searchString = pointToUpdate.value.searchQuery ?? ""
		})

		const store = useStore()
		const provider = new GeoSearch.OpenStreetMapProvider();
		const searchHandler = async (ev: CustomEvent) => {
			data.searchString = ev.detail.value
			if (ev.detail["value"] == "") {
				data.searchResults = []
				return
			}

			data.searchLastDate = new Date()
			setTimeout(async () => {
				if (!data.searchLastDate) return
				// Delay before sending request 
				if ((new Date()).getTime() - data.searchLastDate.getTime() < 500) return

				const results = await provider.search({ query: data.searchString });
				data.searchResults = []
				results.forEach((point:any) => {
					let x: number = point.x
					let y: number = point.y
					let label: string = point.label
					data.searchResults.push(new Point({ x, y, label }))
				})
			}, 1000)
		}



		const closeHandler = () => {
			data.localeIsOpen = false
			if (closeFunc.value)
				closeFunc.value()
			setTimeout(() => {
				store.dispatch('toggle-tabs', true)
				ctx.emit("update:isOpen", false)
				data.localeIsOpen = true
				data.searchResults = []
				data.searchString = ""
				data.searchLastDate = null
			}, 500);
		}

		const selectHandler = (point:Point) => {
			point.searchQuery = data.searchString
			addPointFunc.value(point)
			closeHandler()
		}

		return {
			data,
			isOpen,
			searchField,
			closeHandler,
			selectHandler,
			searchHandler,
			modalContent,
			closeOutline,
			pointToUpdate,
			arrowBackOutline,
		}
	},	
}
</script>

<style scoped>
@import url(../../theme/variables.css);

.add_address_modal{
	position: absolute;
	left: 0;
	bottom: 0;
}

.modal_header{
	font-size: 22px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: relative;
	gap: 10px;
}

.close_button{
	position: absolute;
	top: 0;
	left: 0;
	float: left;
}
.backdrop{
	position: absolute;
	z-index: 1000;

	height: calc(100vh - 56px);
	width: 100vw;

	bottom: 0;
	left: 0;

	background: rgb(24, 24, 24, 0.4);
}

.modal_content{
	background: white;
	border-top: 1px solid var(--ion-color-step-300);
	border-radius: 4px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100vw;
	height: 65vh;
	position: absolute;
	bottom: 0;
	animation: go-up .4s;
	z-index: 1001;
}

@media (prefers-color-scheme: dark) {
	.modal_content {
		background: var( --ion-background-color);
	}
}

.show__content-enter-active{
	animation: show-content .6s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.show__content-leave-active{
	animation: show-content .5s reverse cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes show-content {
	from {
		bottom: -65vh;
	}
	to {
		bottom: 0;
	}
}

.show__backdrop-enter-active {
	animation: fade .75s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.show__backdrop-leave-active {
	animation: fade .75s cubic-bezier(0.22, 0.61, 0.36, 1) reverse;
}

@keyframes fade {
	from { 
		opacity: 0;
	}
	to { 
		opacity: 1;
	}
}

ion-list {
	height: 100%;
	overflow-y: auto;
}
</style>