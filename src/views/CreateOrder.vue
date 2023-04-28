<template>
	<ion-page>
		<OrderCreateForm/>
	</ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import OrderCreateForm from '@/components/forms/order-create-form/OrderCreateForm.vue';

export default {
	name: 'CreateOrder',
	components: {
		IonPage, IonHeader, IonToolbar, IonTitle, IonContent,OrderCreateForm
	}
}
</script>
