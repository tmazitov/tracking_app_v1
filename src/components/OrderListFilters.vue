<template>
	<transition name="filters">
		<div class="filters__content" v-if="isOpen">
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
		isOpen: {
			type: Boolean,
			required: true,
		}
	},
	setup(props){	
		const store = useStore()
		const data = reactive({
			filters: props.filters,
		})
		const isOpen = computed(() => props.isOpen)
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
			isOpen,
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
	width: inherit;
	height: 382px;
	border-radius: 4px;
	padding: 20px;
	
	display: flex;
	flex-direction: column;
	gap: 16px;
	background: white;
	box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

@media (prefers-color-scheme: dark) {
	.filters__content{
		background: var(--ion-color-step-100);
		box-shadow: none;
	}
}	

@media (min-width:768px) {
	.filters__content{
		max-width: 350px;
	}
}

@media (max-width:768px) {
	.filters__content{
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
		max-height: 382px;
		opacity: 1;
	}
}

.filters-content__header{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.filters-content-header__title{
	font-size: 18px;
}

.filter-content-header__clear-button{
	color: var(--ion-color-primary);
	text-decoration: underline;
	cursor: pointer;
}

ion-toggle{
	padding: 10px 16px;
}
</style>