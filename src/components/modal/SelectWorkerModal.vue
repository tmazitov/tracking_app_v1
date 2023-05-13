<template>
	<div class="select-worker">
		<ion-modal ref="modal" trigger="submit" :is-open="data.isOpen">
			<ion-header>
				<ion-toolbar>
				<ion-buttons slot="start">
					<ion-button @click="() => close()">
						<ion-icon :icon="closeOutline"></ion-icon>
					</ion-button>
				</ion-buttons>
				<ion-title>Welcome</ion-title>
				<ion-buttons slot="end">
					<ion-button :disabled="data.selectedWorkerId == -1" :strong="true" @click="selectHandler">
						<ion-icon :icon="checkmarkOutline"></ion-icon>
					</ion-button>
				</ion-buttons>
				</ion-toolbar>
			</ion-header>
			<ion-content class="ion-padding">
				<ion-item v-for="worker in workers" :key="`worker_${worker.id}`">
					{{ worker.shortName }}
				</ion-item>
			</ion-content>
		</ion-modal>
	</div>
</template>

<script lang="ts">
import User from '@/assets/user';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonIcon } from '@ionic/vue';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import { ComputedRef, computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';

export default {
	name: "SelectWorkerModal",
	components: {
		IonModal,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonButton,
		IonTitle,
		IonContent,
		IonItem,
		IonIcon,
	},
	props: {
		isOpen: {
			type: Boolean,
			required: true,
		},
		closer: {
			type: Function,
			required: true,
		},
		selector: {
			type: Function,
			required: true,
		}
	},
	setup(props) {

		const data = reactive({
			selectedWorkerId: -1,
			isOpen: props.isOpen,
		})

		const selectHandler = () => {
			props.selector(data.selectedWorkerId)
		}

		watch(() => props.isOpen, (newValue) => {
			data.isOpen = newValue
		})

		const store = useStore()
		const workers:ComputedRef<Array<User>> = computed(() => store.getters.staffWorkers)
		
		return {
			data,
			workers,
			close: props.closer,
			selectHandler,
			closeOutline,
			checkmarkOutline,
		}
	},
}
</script>

<style lang="" scoped>

</style>