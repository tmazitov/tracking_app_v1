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
				<ion-title>
					Назначить водителя
				</ion-title>
				<ion-buttons slot="end">
					<ion-button :disabled="data.selectedWorkerId == -1" :strong="true" @click="submitHandler">
						<ion-icon :icon="checkmarkOutline"></ion-icon>
					</ion-button>
				</ion-buttons>
				</ion-toolbar>
			</ion-header>
			<ion-content>
				<div class="worker-list">
					<div class="worker" v-for="worker in workers" :key="`worker-${worker.id}`">
						<ion-item>
							<div class="worker-icon" @click="selectHandler(worker)">
								<ion-icon :icon="workerIcon(worker)" color="primary" slot="start"></ion-icon>
							</div>

							<ion-label @click="selectHandler(worker)">{{worker.shortName}}</ion-label>
							
							<div @click="openDetails(worker)">
								<ion-icon v-if="worker.state.detailsIsOpen" :icon="chevronUpOutline"></ion-icon>
								<ion-icon v-else :icon="chevronDownOutline"></ion-icon>
							</div>
						</ion-item>
						<transition name="details">
							<div class="worker-details" v-if="worker.state.detailsIsOpen">
								<div class="worker-details__content">
									<ion-item class="worker-details__order" 
									v-for="order in workerOrders(worker)" 
									:key="`order_${order.orderId}`">
										<div class="worker-details__order-time">{{order.getTime()}}</div>
										<ion-label>{{ order.title }}</ion-label>
									</ion-item>
								</div>
							</div>
						</transition>
					</div>
				</div>

			</ion-content>
		</ion-modal>
	</div>
</template>

<script lang="ts">
import Order from '@/assets/order';
import User from '@/assets/user';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonIcon, IonLabel } from '@ionic/vue';
import { closeOutline, checkmarkOutline, radioButtonOffOutline, radioButtonOnOutline, chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { ComputedRef, computed, reactive, watch } from 'vue';
import { useStore } from 'vuex';

export default {
	name: "SelectWorkerModal",
	components: {
		IonModal,
		IonLabel,
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
		selectedWorkerId: {
			type: Number,
			default: -1,
		},
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
			selectedWorkerId: props.selectedWorkerId,
			isOpen: props.isOpen,
		})

		const submitHandler = () => {
			props.selector(data.selectedWorkerId)
			props.closer()
			workers.value.forEach((worker:User) => worker.state.detailsIsOpen = false)
		}

		const selectHandler = (worker:User) => {
			data.selectedWorkerId = data.selectedWorkerId != worker.id ? 
				worker.id:
				-1
		}

		const workerIcon = (worker:User) => {
			return worker.id==data.selectedWorkerId?radioButtonOnOutline:radioButtonOffOutline
		}

		const workerOrders = (worker:User):Array<Order> => {
			return store.getters.orderLitsByWorker(worker)
		}
		
		const openDetails = (worker:User) => {
			worker.state.detailsIsOpen = !worker.state.detailsIsOpen
		}

		watch(() => props.isOpen, (newValue) => {
			data.isOpen = newValue
		})

		const store = useStore()
		const workers:ComputedRef<Array<User>> = computed(() => store.getters.staffWorkers)
		
		return {
			data,
			workers,
			workerOrders,
			workerIcon,
			openDetails,
			close: props.closer,
			selectHandler,
			submitHandler,
			closeOutline,
			checkmarkOutline,

			chevronUpOutline,
			chevronDownOutline,
		}
	},
}
</script>

<style scoped>

@import url(../../theme/variables.css);
.worker-list{
	display: flex;
	flex-direction: column;
	gap: 16px;

	padding: 16px;
}

.worker-icon{
	width: 32px;
}
.worker-details{
	background: var(--ion-item-background);
	border-top: 1px solid var(--ion-color-step-200);
	
	overflow-y: auto;
	
	max-height: 192px;
	height: fit-content;
}

.details-enter-active{
	overflow:hidden;
	animation: details .4s;
}	
.details-leave-active{
	overflow:hidden;
	animation: details .4s reverse;
}

@keyframes details {
	from {
		max-height: 0;
	}	
	to {
		max-height: 192px;
	}
}

.worker-details__order-time{
	margin-right: 16px;
	width: 40.5px;
}

</style>