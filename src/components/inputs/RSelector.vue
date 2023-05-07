<template>
	<div class="r-selector">
		<ion-list>
			<ion-item>
				<ion-select :label="data.label"
					:multiple="data.multiple"
					v-model="data.currentValue"
					@ion-change="changeHandler"
					interface="popover">
					<ion-select-option v-for="item, index in getItems()" :key="`ion_selector_${index}`" :value="item.value">
						{{ item.title }}
					</ion-select-option>
					
					<ion-select-option class="clear"  v-if="!valueIsEmpty" :value="-1">
						Очистить
					</ion-select-option>
				</ion-select>
			</ion-item>
		</ion-list>
		<!-- <div class="r-selector__clear-button" @click="clearHandler">
			<ion-icon name="close-circle-outline"></ion-icon>
		</div> -->
	</div>
</template>

<script lang="ts">
import SelectableItem from '@/assets/selectableItem';
import { IonSelectCustomEvent } from '@ionic/core';
import { IonItem, IonLabel, IonList, IonRadio, IonSelect, IonSelectOption, IonIcon, SelectChangeEventDetail } from '@ionic/vue';
import { computed, reactive, ref, watch } from 'vue';

export default {
	name: "RSelector",
	components: { IonItem, IonList, IonSelect, IonSelectOption, IonLabel, IonRadio, IonIcon },
	props: {
		currentItem: { 
			type: [Number, Array],
			required: true,
		},
		items: {
			type: Array<SelectableItem>,
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
		multiple: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const data = reactive({
			...props,
			currentValue: props.currentItem,
		})
		
		watch(() => props.currentItem, (newValue) => {
			data.currentValue = newValue
		})

		const changeHandler = (ev:IonSelectCustomEvent<SelectChangeEventDetail<any>>) => {
			data.selector(data.currentValue)
		}

		const valueIsEmpty = computed(() => {
			if (typeof data.currentValue == 'object'){
				return true
			}
			else if (typeof data.currentValue == 'number'){
				return data.currentValue == -1
			}
		})
		const getItems = () => props.items

		return {
			getItems,
			changeHandler,
			data,
			valueIsEmpty,
		}
	}
}
</script>

<style scoped>
.r-selector{
	position: relative;
}

.r-selector__clear-button{
	position: absolute;
	right: 0;
	top: 0;
	
	height: 100%;

	display: flex;
	justify-content: center;
	align-items: center;
}

.clear{
	color: red;
}
</style>