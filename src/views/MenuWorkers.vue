<template>
	<ion-page class="menu-workers">
		<ion-content>

			<ion-segment :value="data.segment" mode="ios" @ionChange="onChangeSegment">
				<ion-segment-button value="current">
				  <ion-label>Текущие</ion-label>
				</ion-segment-button>
				<ion-segment-button value="new">
				  <ion-label>Новые - {{data.offers.length}}</ion-label>
				</ion-segment-button>
			</ion-segment>

			<div id="content" v-if="data.segment == 'current'">
				<ion-card>
					<ion-card-header>
						<ion-card-title>Менеджеры</ion-card-title>
						<ion-card-subtitle>Обрабатывают заявки и договариваются с заказчиками</ion-card-subtitle>
					</ion-card-header>
					<ion-card-content>
						<ion-list v-if="currentManagers.length > 0">
							<ion-item v-for="manager in currentManagers" :key="`manager-${manager.id}`">
								<ion-icon :icon="personCircleOutline" slot="start"></ion-icon>
								<ion-label>{{manager.shortName}}</ion-label>
								<ion-icon :icon="ellipsisHorizontalOutline" slot="end"></ion-icon>
							</ion-item>
						</ion-list>
						<ion-list v-else>
							<ion-item>
								<ion-label>Нет менеджеров</ion-label>
							</ion-item>
						</ion-list>
					</ion-card-content>
	
				</ion-card>
				<ion-card>
					<ion-card-header>
						<ion-card-title>Водители</ion-card-title>
						<ion-card-subtitle>Выполняют перевозки по назначенным заявкам</ion-card-subtitle>
					</ion-card-header>
					<ion-card-content>
						<ion-list v-if="currentWorkers.length > 0">
							<ion-item v-for="worker in currentWorkers" :key="`worker-${worker.id}`">
								<ion-icon :icon="personCircleOutline" slot="start"></ion-icon>
								<ion-label>{{worker.shortName}}</ion-label>
								<ion-icon :icon="ellipsisHorizontalOutline" slot="end"></ion-icon>
							</ion-item>
						</ion-list>
						<ion-list v-else>
							<ion-item>
								<ion-label>Нет водителей</ion-label>
							</ion-item>
						</ion-list>
					</ion-card-content>
				</ion-card>

				<ion-card>
					<ion-card-header>
						<ion-card-title>Время работы</ion-card-title>
					</ion-card-header>
					<ion-card-content class="work-time-container" v-if="data.staffWorkTime && data.originStaffWorkTime" >
						<div class="work-time">
							<ion-input 
							label="Начало" type="time" fill="outline" :value="data.staffWorkTime.startAt" @ionInput="updateStartWorkTime"></ion-input>
							<ion-input 
							label="Конец" type="time" fill="outline" :value="data.staffWorkTime.endAt" @ionInput="updateEndWorkTime"></ion-input>
						</div>
						<ion-button v-if="!data.staffWorkTime.isEqual(data.originStaffWorkTime)" @click="updateWorkTime">
							Сохранить
						</ion-button>
					</ion-card-content>
				</ion-card>
			</div>

			<div class="content" v-if="data.segment == 'new'">
				<ion-card>
					<ion-card-header>
						<ion-card-title>Заявки на работу</ion-card-title>
						<ion-card-subtitle>От людей, которые хотят работать с вами</ion-card-subtitle>
					</ion-card-header>
	
					<ion-card-content>
						<ion-list v-if="data.offers.length > 0">
							<div class="offer" v-for="offer,index in data.offers" :key="`application-${index}`" >
								<ion-item button :detail="true" @click="toggleOfferDetails(offer.id)"> 
									<ion-icon :icon="documentTextOutline" slot="start"></ion-icon>
									<ion-label>Заявка №{{offer.id}}</ion-label>
								</ion-item>
								<transition name="details">
									<div class="offer__content" v-if="offer.id == data.offerDetailsId">
										<ion-card-header>
											<ion-card-subtitle>
												{{offer.getJobType()}} со стажем {{ offer.getJobExpString() }}
											</ion-card-subtitle>
										</ion-card-header>
										<ion-card-content>
											<div v-if="offer.jobMail" class="offer__mail">
												{{ offer.jobMail }}
											</div>
										</ion-card-content>
										<div class="button-container">
											<ion-button color="primary" @click="offerAccept(offer.id)">
												Добавить
											</ion-button>
											<ion-button color="danger" fill="clear" @click="offerReject(offer.id)">
												Отказать
											</ion-button>
										</div>
									</div>
								</transition>
							</div>
						</ion-list>
						<ion-list v-else>
							<ion-item>
								<ion-label class="empty">Нет заявлений</ion-label>
							</ion-item>
						</ion-list>
					</ion-card-content>
				</ion-card>
			</div>
			<ion-toast :is-open="data.toastSuccess"
				message="Успешно!"
				:duration="2000"
				layout="stacked"
				color="success"
				:icon="checkmarkCircleOutline">
			</ion-toast>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { AdminAPI } from '@/api/admin';
import TMS from '@/api/tms';
import StaffWorkTime from '@/assets/staffWorkTime';
import User from '@/assets/user';
import UserOffer from '@/assets/userOffer';
import { IonPage, IonContent, IonCard, IonCardSubtitle, IonCardTitle, IonButton, IonIcon, IonItem, IonList, IonLabel, IonInput, IonText, IonCardContent, IonCardHeader, IonSegment, IonSegmentButton, IonToast, onIonViewWillEnter } from '@ionic/vue';
import { checkmarkCircleOutline, chevronDownOutline, closeOutline, documentTextOutline, ellipsisHorizontalOutline, personCircleOutline } from 'ionicons/icons';
import { ComputedRef, computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
	name: "MenuWorkers",
	components: {
		IonPage,
		IonText,
		IonButton,
		IonContent,
		IonCard,
		IonCardContent,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonList,
		IonItem,
		IonIcon,
		IonLabel,
		IonInput,
		IonSegment,
		IonToast,
		IonSegmentButton,
	},
	setup(props, ctx) {

		let store = useStore()
		let router = useRouter()

		const data = reactive<{
			segment: string,
			offers: Array<UserOffer>,
			offerDetailsId: number,
			toastSuccess:boolean,
			originStaffWorkTime: StaffWorkTime|null,
			staffWorkTime: StaffWorkTime|null,
		}>({
			segment: "current",
			offers: [],
			offerDetailsId: -1,
			toastSuccess:false,
			originStaffWorkTime: null,
			staffWorkTime: null,
		})
		
		const onChangeSegment = (ev:CustomEvent) => data.segment = ev.detail.value

		const toggleOfferDetails = (offerId:number) => {
			if (offerId == data.offerDetailsId){
				data.offerDetailsId = -1
			} else if (data.offerDetailsId == -1){
				data.offerDetailsId = offerId
			} else {
				data.offerDetailsId = -1
				setTimeout(() => data.offerDetailsId = offerId, 300)
			}
		}


		const user:ComputedRef<User> = computed(() => store.getters.userMainInfo)

		const currentWorkers:ComputedRef<Array<User>>  = computed(() => store.getters.staffWorkers)
		const currentManagers:ComputedRef<Array<User>> = computed(() => store.getters.staffManagers)


		onIonViewWillEnter(() => {
			if (user.value.roleId && user.value.roleId != 3) router.push({name:"home"})
			
			AdminAPI.offerList().then(response => {
				if (!response.data) return
				if (response.data.err) throw response.data.err

				let offers:Array<UserOffer> = []
				let offersData = response.data["offers"]
				offersData.forEach((offerData:any) => {
					offers.push(new UserOffer(offerData))
				})
				data.offers = offers
			})	
			TMS.user().getStaffWorkTime().then(response => {
				if (!response.data) return
				if (response.data.err) throw response.data.err

				data.staffWorkTime = new StaffWorkTime(response.data)
				data.originStaffWorkTime = new StaffWorkTime(response.data)
			})
		})

		const offerAccept = (offerId:number) => {
			AdminAPI.offerAccept(offerId).then((response) => {
				if (!response.data) return
				if (response.data.err) throw response.data.err

				let newStaff:User = new User(response.data)
				store.dispatch("add-staff", newStaff)
				data.offerDetailsId = -1
				setTimeout(() => {
					data.offers = data.offers.filter((offer:UserOffer) => offer.id != offerId)
					data.toastSuccess = true
				}, 350)
			})
		}
		const offerReject = (offerId:number) => {
			AdminAPI.offerReject(offerId).then((response) => {
				if (!response.data) return
				if (response.data.err) throw response.data.err

				data.offerDetailsId = -1
				setTimeout(() => {
					data.offers = data.offers.filter((offer:UserOffer) => offer.id != offerId)
					data.toastSuccess = true
				}, 350)
			})
		}

		const updateStartWorkTime = (ev:CustomEvent) => {
			if (!data.staffWorkTime) return

			data.staffWorkTime.startAt = ev.detail.value
		}


		const updateEndWorkTime = (ev:CustomEvent) => {
			if (!data.staffWorkTime) return

			data.staffWorkTime.endAt = ev.detail.value
		}

		const updateWorkTime = () => {
			if (!data.staffWorkTime) return
			AdminAPI.staffUpdateWorkTime(data.staffWorkTime).then(() => {
				if (!data.staffWorkTime || !data.originStaffWorkTime) return
				data.originStaffWorkTime.startAt = data.staffWorkTime.startAt
				data.originStaffWorkTime.endAt = data.staffWorkTime.endAt
			})
		}

		return {
			data,
			currentWorkers,
			currentManagers,
			personCircleOutline,
			documentTextOutline,
			ellipsisHorizontalOutline,
			chevronDownOutline,
			toggleOfferDetails,
			closeOutline,
			onChangeSegment,
			offerAccept,
			offerReject,
			checkmarkCircleOutline,
			updateStartWorkTime,
			updateEndWorkTime,
			updateWorkTime,
		}
	},
}
</script>

<style scoped>
.add-manager-form{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

ion-list.no-overflow {
	max-height: 147px;
	overflow-y: auto;
}

ion-label.empty {
	color: var(--ion-color-step-400);
	text-align: center;
}

.button-container {
	padding: 16px;
	padding-top: 0;
	display: flex;
	flex-direction: row;
	gap: 16px;
}

.offer__mail{
	max-height: 140px;
	overflow-y: auto;
}

.offer__content{
	max-height: 240px;
}

.details-enter-active{
	animation: .3s details ease-in;
}
.details-leave-active{
	animation: .3s details ease-out reverse;
}

@keyframes details {
	from {
		max-height: 0;
		opacity: 0;
	}
	to {
		max-height: 240px;
		opacity: 1;
	}
}

.work-time{
	display: flex;
	flex-direction: row;
	gap: 16px;
}

.work-time-container{
	display: flex;
	flex-direction: column;
	gap: 16px;
}
</style>