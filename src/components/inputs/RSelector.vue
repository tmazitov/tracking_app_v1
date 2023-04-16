<template>
	<div class="r-selector">
		<ion-list>
			<ion-item>
				<ion-select :label="data.label"
					:multiple="data.multiple"
					v-model="data.currentValue"
					@ion-change="changeHandler"
					interface="popover">
					<ion-select-option v-for="item in data.items" :value="item.value">
						{{ item.title == "" ? "Clear" : item.title }}
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
import { reactive } from 'vue';

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
	setup(props, ctx) {
		const data = reactive({
			...props,
			currentValue: props.currentItem,
		})

		const changeHandler = (ev:IonSelectCustomEvent<SelectChangeEventDetail<any>>) => {
			data.selector(data.currentValue)
		}

		return {
			changeHandler,
			data,
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
</style>