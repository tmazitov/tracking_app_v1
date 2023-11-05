<template>
	<ion-button fill="outline" expand="block" @click="openModal"> 
		<ion-icon slot="start" :icon="addOutline"></ion-icon>
		Добавить точку
	</ion-button>

	<AddAddressModal 
		v-model:isOpen="data.modalIsOpen"
		:addPointFunc="addPointFunc" 
		:closeFunc="closeFunc"
		:pointToUpdate="pointToUpdate"/>
</template>

<script lang="ts">
import { reactive, computed, onUpdated } from 'vue';
import { IonInput, IonButton, IonIcon } from '@ionic/vue';
import AddAddressModal from '../modal/AddAddressModal.vue';
import { useStore } from 'vuex';
import { addOutline, locationOutline } from 'ionicons/icons';
import Point from '@/assets/point';

export default {
	name: "RAddressInput",
	components: {
		IonInput,
		IonButton,
		IonIcon,
		AddAddressModal,
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
		}
	},
	setup(props, ctx) {
		const data = reactive({
			modalIsOpen : false,
		})

		const closeFunc = computed(() => props.closeFunc)
		const addPointFunc = computed(() => props.addPointFunc)
		const pointToUpdate = computed(() => props.pointToUpdate)
		const store = useStore()
		const openModal = () => {
			store.dispatch('toggle-tabs')
			setTimeout(() => {
				data.modalIsOpen = true
			}, 350)
		}

		onUpdated(() => {
			if (pointToUpdate.value)
				openModal()
		})

		return {
			data,
			openModal,
			locationOutline,
			addOutline,
			closeFunc,
			pointToUpdate,
			addPointFunc,
		}
	},	
}
</script>

<style scoped>

</style>