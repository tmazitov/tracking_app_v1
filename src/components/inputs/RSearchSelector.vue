<template>
	<div class="r-search-selector">

		<ion-input v-model="data.search" label-placement="floating" fill="solid" :clear-input="true"
			label="Введите адрес" @ion-input="(ev)=>searchHandler(ev)" 
			@ion-focus="openItemsHandler"
			@ion-blur="closeItemsHandler">
		</ion-input>

		<transition name="search">
			<div class="search-selector__items" v-if="data.search != '' && data.itemsIsOpen">
				<div v-if="data.search.length != 0 && items.length > 0">
					<div class="search-selector__item" v-for="item, index in items"
						:key="`searched_point_${index}`" @click="() => chooseHandler(item)">
						{{ item.title ?? item.name }}
					</div>
				</div>
				<div v-else class="search-selector__empty">
					{{data.emptyItemsString ?? 'Элементы не найдены'}}
				</div>
			</div>
		</transition>

	</div>
</template>

<script lang="ts">
import { IonInputCustomEvent, InputInputEventDetail } from '@ionic/core';
import { IonInput } from '@ionic/vue';
import { computed, ComputedRef, reactive } from 'vue';

export default {
	name:'SearchSelector',
	components:{
		IonInput,
	},
	props: {
		items: {
			type: Array<any>,
			required: true,
		},
		selector: {
			type: Function,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		emptyItemsString: String,
		searchFunction: Function,
	},
	setup(props,ctx){
		const items:ComputedRef<Array<any>> = computed(() => props.items)
		const data = reactive<{
			search:string
			label:string
			emptyItemsString:string|undefined
			itemsIsOpen:boolean
		}>({
			search: "",
			label: props.label,
			emptyItemsString: props.emptyItemsString,
			itemsIsOpen: false,
		})

		const openItemsHandler = () => data.itemsIsOpen = true
		const closeItemsHandler = () => data.itemsIsOpen = false

		const searchHandler = (ev:IonInputCustomEvent<InputInputEventDetail>) => {
			let action:Function|undefined = props.searchFunction
			if (action){
				action(ev)
			}
		}
		
		const chooseHandler = (searchedItem:any) => {
			props.selector(searchedItem)
			data.search = ""
		}

		return {
			searchHandler,
			chooseHandler,
			openItemsHandler,
			closeItemsHandler,
			items,
			data
		}
	}
}
</script>

<style scoped>


	@import url(../../theme/variables.css);

	.search-selector__items{
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

	.search-selector__item{
		padding: 16px;
		cursor: pointer;
	}

	.search-selector__item:hover{
		background: var(--ion-color-step-50);
	}

	.search-selector__item:not(:last-child){
		border-bottom: 1px solid var(--ion-color-step-200);
	}

	.search-selector__empty{
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

	.search-selector{
		height: 56px;
		width: 100%;

		background: var(--ion-color-step-50);
		border-bottom: 1px solid var(--ion-color-step-500, grey);
		border-radius: 4px 4px 0 0;

		padding: 0 16px;
	}

	.search-selector__small-label{
		height: 20px;
		font-size: 12px;
		display: flex;
		align-items: end;
	}

	.search-selector__small-label > a {
		height: fit-content;
	}

	.search-selector__value{
		height: 36px;
	}
</style>