<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Новый заказ</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<div class="form-container">
				<OrderCreateForm/>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import OrderCreateForm from '@/components/OrderCreateForm.vue';

export default {
	name: 'CreateOrder',
	components: {
		IonPage, IonHeader, IonToolbar, IonTitle, IonContent,OrderCreateForm
	}
}
</script>

<style scoped>
.form-container{
	display: flex;
	justify-content: center;

	height: 100%;
	width: 100%;
}

</style>