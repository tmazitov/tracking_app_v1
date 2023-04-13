<template>
	<div class="order_create_form">
		<div class="form__container">
			<div class="form-container__title-container">
				<div class="closer" @click="() => {close()}">
					<ion-icon size="large" :icon="arrowBackOutline"></ion-icon>
				</div>
				<ion-title class="large">Новый заказ</ion-title>
			</div>
			<OrderPointsMap/>
		</div>
	</div>
</template>

<script lang="ts">
import OrderPointsMap from './OrderPointsMap.vue';
import {  IonTitle, IonIcon } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';

export default {
	name: 'OrderCreateForm',
	components: {
		OrderPointsMap,
		IonTitle,
		IonIcon
	},
	props: {
		closer: {
			type: Function,
			required: true,
		}
	},
	setup(props) {
		return {
			close: props.closer,
			arrowBackOutline,
		}
	}
}
</script>

<style scoped>

@import url(../theme/variables.css);
.order_create_form {
	width: 100vw;
	z-index: 12;
	display: flex;
	justify-content: center;
	position: relative;
}


.form__container {
	margin: 10px;
	height: calc(100vh - 113px);
	position: absolute;
	width: 450px;
	background: #323232;
	margin: 0 auto;

	border-radius: 8px;
	padding: 25px;

	display: flex;
	flex-direction: column;
	gap: 16px;
}

ion-title.large {
	font-size: 28px;
	padding: 0;
	text-align: center;
}

.form-container__title-container {
	display: grid;
	grid-template-columns: 28px calc(100% - 28px - 32px - 28px) 28px;
	grid-column-gap: 16px;
}


</style>