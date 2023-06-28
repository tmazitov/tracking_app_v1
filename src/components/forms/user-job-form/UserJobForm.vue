<template>
	<div class="user-job-form">
		<RSelector 					
		v-model:current-item="form.jobType"
		:items="jobTypes" 
		:selector="selectJobType"
		label="Тип работы">
		</RSelector>



		<div class="experience">
			<ion-input 
			type="number" v-model="form.jobExperience" min="0"
			label="Опыт работы" label-placement="floating" fill="solid">
			</ion-input>
	
			<div class="ion-activatable ripple-parent form__helpers-button"  
			@click="() => form.jobExperience += 1">
				<ion-icon :icon="add"></ion-icon>
				<ion-ripple-effect></ion-ripple-effect>
			</div>
			<div class="ion-activatable ripple-parent form__helpers-button" 
			@click="() => {if (form.jobExperience > 0) form.jobExperience -= 1}">
				<ion-icon :icon="remove" ></ion-icon>
				<ion-ripple-effect></ion-ripple-effect>
			</div>
		</div>

		<ion-textarea label="Сопроводительное письмо" labelPlacement="floating" fill="solid" v-model="form.jobMail"></ion-textarea>
		<ion-toast 
			:isOpen="data.isOpen"
			:message="data.toastSuccess ? 'Форма успешно отпправлена!' : 'Форма некорректна'"
			:duration="2000"
			@didDismiss="setToastOpen(false, false)"
			:color="data.toastSuccess ? 'success' : 'danger'"
			position="top"
		></ion-toast>
		<div class="button-container">
			<ion-button @click="submit">Отправить</ion-button>
		</div>
	</div>
</template>

<script lang="ts">
import { ComputedRef, computed, reactive, watch } from "vue";
import SelectableItem from "../../../assets/selectableItem"
import UserJobForm from "./instance"
import {IonButton, IonIcon, IonInput, IonRippleEffect, IonTextarea, IonToast} from "@ionic/vue"
import RSelector from "../../inputs/RSelector.vue"
import { add, remove } from "ionicons/icons";
import TMS from "@/api/tms";
import { useStore } from "vuex";
import User from "@/assets/user";
import { useRouter } from "vue-router";

export default {
	name: "UserJobForm",
	components: {
		IonInput,
		IonToast,
		RSelector,
		IonIcon,
		IonButton,
		IonTextarea,
		IonRippleEffect,
	},
	setup(){
		const data = reactive({
			isOpen: false,
			toastSuccess: false
		})

		const setToastOpen = (value:boolean, success:boolean) => {
			data.isOpen = value
			data.toastSuccess = success
		}

		const router = useRouter()
		const store = useStore()
		const form = reactive(new UserJobForm())
		const selectJobType = (jobIndex:number) => {
			form.jobType = jobIndex
		}

		watch(() => form.jobExperience,(newValue) => {
			form.jobExperience = Number(newValue)
		})

		const jobTypes:Array<SelectableItem> = [
			{title: "Водитель", value: 1},
			{title: "Менеджер", value: 2},
		]

		const submit = () => {
			if (!form.isValid()) {
				setToastOpen(true, false)
				return
			}

			TMS.user().offerSubmit(form).then(response => {
				if (response.data && response.data.err) throw response.data.err
				store.dispatch("setup-offer", response.data["offerId"])
				setToastOpen(true, true)
				setTimeout(() => {
					router.push({name: "menu"})
				}, 100)
			}).catch(() => {
				setToastOpen(true, false)
			})
		}

		return {
			data,
			form,
			jobTypes,
			selectJobType,
			add,
			remove,
			submit,
			setToastOpen,
		}
	}	
}
</script>

<style scoped>
.form__helpers-button {
	display: flex;
	justify-content: center;
	align-items: center;

	background: var(--ion-color-step-50, #f2f2f2);
	border-radius: 4px;

	width: 56px;
	height: 56px;
	cursor: pointer;
}

.ripple-parent {
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    overflow: hidden;

    user-select: none;
}

.experience{
	display: grid;
    grid-template-columns: calc(100% - 16px - 56px - 16px - 56px) 56px 56px;
    grid-column-gap: 16px;
}

.user-job-form{
	display: flex;
	flex-direction: column;
	gap: 10px
}

ion-textarea{
	height: 140px;
}

.button-container{
	position: absolute;
	bottom: 10px;
	right: 10px;
	left: 10px;
}

.button-container > ion-button {
	width: 100%;
}
</style>