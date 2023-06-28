<template>
	<ion-page>
		<ion-content >
			<div class="content" v-if="offerId == null">
				<div class="content__card">
					<div class="content__icon">
						<img src="/briefcase-outline.svg" height="140">
					</div>
					<div class="content__title">
						Стань нашим работником!
					</div>
					<div class="content__subtitle">
						Оформи заявку на работу и получишь
					</div>
				</div>
				<div class="button-container">
					<ion-button @click="goToForm">Перейти</ion-button>
				</div>
			</div>
			<div class="content" v-if="offerId">
				<div class="content__card" >
					<div class="content__card">
						<div class="content__icon">
							<img src="/time-outline.svg" height="140">
						</div>
						<div class="content__title">
							Заявка №{{ offerId }} в обработке
						</div>
						<div class="content__subtitle">
							Наш администратор свяжется с вами в ближайшее время.
						</div>
					</div>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue';
import { briefcaseOutline } from 'ionicons/icons';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
	name: "MenuJob",
	components: {
		IonPage,
		IonIcon,
		IonContent,
		IonButton,
	},
	setup(props, ctx) {
		const store = useStore()
		const router = useRouter()
		const goToForm = () => router.push({name:"settings-job-form"})


		const offerId = computed(() => store.getters.userOffer)

		return {
			offerId,
			briefcaseOutline,
			goToForm,
		}
	},
}
</script>

<style scoped>
.content {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 100%;
}

.content__card{
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
	margin: 0 15px;
}

.content__title {
	font-size: 1.2em;
}

.content__subtitle{
	color: var(--ion-color-step-600);
	text-align: center;
	font-size: 0.9em;
}

.button-container{
	position: absolute;
	bottom: 10px;
	right: 10px;
	left: 10px
}

.button-container > ion-button {
	width: 100%;
}

</style>