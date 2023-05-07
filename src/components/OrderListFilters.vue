<template>
	<div class="order-list-filters">
		<div class="filters__button" @click="toggleFilters">
			<ion-icon :icon="data.filtersIsOpen? closeOutline: optionsOutline" color="primary"></ion-icon>
		</div>
		<transition name="filters">
			<div class="filters__content" v-if="data.filtersIsOpen">
				<div class="filters-content__header">
					<div class="filters-content-header__title">
						Фильтры
					</div>
					<div class="filter-content-header__clear-button" @click="clearFilters">
						Очистить
					</div>
				</div>
				<RSelector
					v-model:current-item="data.filters.workerId"
					:items="workers" 
					:selector="selectWorker"
					label="Водитель"
				/>
				<RSelector
					v-model:current-item="data.filters.status"
					:items="orderStatuses"
					:selector="selectStatus"
					label="Статус заказа"
					multiple
				/>
				<RSelector
					v-model:current-item="data.filters.type"
					:items="orderTypes"
					:selector="selectType"
					label="Тип заказа"
					multiple
				/>
				<ion-toggle 
					:checked="data.filters.isRegularCustomer" 
					:enable-on-off-labels="true"
					v-on:ion-change="selectRegularCustomer"
				>
					Постоянный клиент
				</ion-toggle>
			</div>                     
		</transition>
	</div>
</template>

<script lang="ts">
import { OrderListFiltersInstance, orderStatuses, orderTypes } from '@/assets/orderListFilters';
import { IonIcon, IonToggle, ToggleCustomEvent } from '@ionic/vue';
import { optionsOutline, closeOutline } from 'ionicons/icons';
import { computed, reactive } from 'vue';

import RSelector from '@/components/inputs/RSelector.vue'
import { useStore } from 'vuex';

export default {
	name: 'OrderListFilters',
	components: {
		IonIcon,
		IonToggle,
		RSelector,
	},
	emits: ['update:filters'],
	props: {
		filters: {
			type: OrderListFiltersInstance,
			required: true, 
		},
	},
	setup(props){	
		const store = useStore()
		const data = reactive({
			filtersIsOpen: false,
			filters: props.filters,
		})
	
		const toggleFilters = () => data.filtersIsOpen = !data.filtersIsOpen
		const closeFilters = () => data.filtersIsOpen = false
		const clearFilters = () => props.filters.clear()

		const filtersIsChanged = computed(() => {
			return data.filters.isEqual(props.filters)
		})

		const workers = computed(() => store.getters.staffWorkers)
		const selectWorker = (workerId:number) => {
			props.filters.workerId = workerId
		}

		const selectStatus = (orderType:Array<number>) => {
			props.filters.status = orderType
		}

		const selectType = (orderType:Array<number>) => {
			props.filters.type = orderType
		}
		
		const selectRegularCustomer = (ev:ToggleCustomEvent) => {
			props.filters.isRegularCustomer = ev.detail.checked
		}


		return {
			data,
			toggleFilters,
			closeFilters,
			clearFilters,
			filtersIsChanged,

			optionsOutline,
			closeOutline,

			workers,
			selectWorker,

			orderStatuses,
			selectStatus,

			orderTypes,
			selectType,
			
			selectRegularCustomer,
		}
	}
}
</script>

<style scoped>

@import url(../theme/variables.css);
.order-list-filters{
	height: 100%;
	position: relative;
}

.filters__button{
	height: 100%;
	width: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.filters__button > ion-icon{
	height: 24px;
	width: 24px;
}

.filters__content{
	position: absolute;
	top: 58px;
	right: -10px;
	width: calc(100vw - 20px);
	height: 362px;
	background: var(--ion-color-step-100);
	border-radius: 4px;
	z-index: 3;
	padding: 20px;
	
	display: flex;
	flex-direction: column;
	gap: 16px;
}

@media (min-width:768px) {
	.filters__content{
		width: calc(60vw - 20px);
		max-width: 350px;
	}
}

@media (max-width:768px) {
	.filters__content{
		width: calc(100vw - 20px);
		max-width: 640px;
	}
}

.filters-enter-active{
	animation: filters .4s;
}
.filters-leave-active{
	animation: filters .4s reverse;
}

@keyframes filters {
	from{
		max-height: 0;
		opacity: 0;
	}
	to{
		max-height: 340px;
		opacity: 1;
	}
}

.filters-content__header{
	display: grid;
	grid-template-columns: auto 70px;
	column-gap: 15px;
}

.filters-content-header__title{
	font-size: 18px;
}

.filter-content-header__clear-button{
	color: var(--ion-color-primary);
	text-decoration: underline;
	cursor: pointer;
}
</style>