<template>
	<div class="number-input" v-bind:class="{
		buttons: step != undefined, 
	}">
		<ion-input 
		ref="inputRef"
		type="number"
		:class="inputType"
		:value="value" :max="max" :min="min" autocorrect="on"
		:label="label" label-placement="floating" fill="outline"
		@ionInput="onInputHandler">
		</ion-input>

		<div v-if="step" 
		class="ion-activatable ripple-parent form__helpers-button"  
		@click="plusHandler">
			<ion-icon :icon="add"></ion-icon>
			<ion-ripple-effect></ion-ripple-effect>
		</div>
		<div v-if="step"
		class="ion-activatable ripple-parent form__helpers-button" 
		@click="minusHandler">
			<ion-icon :icon="remove"></ion-icon>
			<ion-ripple-effect></ion-ripple-effect>
		</div>
	</div>
</template>

<script lang="ts">
import { IonInput, IonIcon, IonRippleEffect } from '@ionic/vue';
import { add, remove } from 'ionicons/icons';
import { ComponentPublicInstance, computed, reactive, ref } from 'vue';

export default {
	name: "RNumberInput",
	components:{
		IonInput,
		IonIcon,
		IonRippleEffect,
	},

	emits: ['update:value'],
	props: {
		value: {
			type: Number,
			required: true,
		},
		inputType: String,
		label: String,
		step: Number,
		min: Number,
		max: Number,
	},
	setup(props,ctx){

		const inputRef = ref<ComponentPublicInstance<HTMLInputElement>>()
		const value = computed({
			get: () => props.value,
			set: (newValue:number) => ctx.emit("update:value", newValue)
		})
		const label = computed(() => props.label)
		const step = computed(() => props.step)
		const max = computed(() => props.max)
		const min = computed(() => props.min)
		const inputType = computed(() => props.inputType)
		const data = reactive({
			errorText: ""
		})

		const plusHandler = () => {
			if (!step.value) return
			if (max.value != undefined && value.value >= max.value) return
			value.value += step.value
		}

		const minusHandler = () => {
			if (!step.value) return
			if (min.value != undefined && value.value <= min.value ) return
			value.value -= step.value
		}

		const onInputHandler = (ev:CustomEvent) => {
			if (!inputRef.value) return
			let valueNumber = Number(ev.detail.value)

			if (max.value != undefined && valueNumber > max.value) {
				valueNumber = max.value
			}
			if (min.value != undefined && valueNumber < min.value ) {
				valueNumber = min.value
			}

			value.value = valueNumber
			inputRef.value.$el.value = valueNumber
		}

		return {
			data,
			value,
			label,
			inputRef,
			inputType,
			step,
			min,
			max,
			add,
			remove,
			plusHandler,
			minusHandler,
			onInputHandler,
		}
	}
}
</script>

<style scoped>
.number-input.buttons{
	display: grid;
	grid-template-columns: calc(100% - 16px - 56px - 16px - 56px) 56px 56px;
	column-gap: 16px;
}

ion-input{
	width: 100%;
}

.ripple-parent {
	display: flex;
	justify-content: center;	
	align-items: center;

    position: relative;
    overflow: hidden;

    user-select: none;
	background: var(--ion-color-step-50, #f2f2f2);
	border-radius: 4px;
	border: 1px solid var(--ion-color-step-300);

	width: 56px;
	height: 56px;
	cursor: pointer;
}

.price::after {
	content: '₽';
	position: absolute;
	right: 16px; /* Adjust the position as per your requirements */
	top: 50%;
	transform: translateY(-50%);
}
.hour::after {
	content: 'ч.';
	position: absolute;
	right: 16px; /* Adjust the position as per your requirements */
	top: 50%;
	transform: translateY(-50%);
}
</style>