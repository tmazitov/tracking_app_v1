<template>
	<ion-page>
		<ion-content  :fullscreen="true">
			<div class="blocks-container">
				<div class="main-info-block">
					<h1>{{ user.shortName }}</h1>
					<p>{{ user.getRoleName()}}</p>
				</div>
	
				<div class="last-orders-block">
					<h5>Последние заказы</h5>
				</div>
	
				<div class="statistics-block">
					<h5>Статистика</h5>	
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
	name: 'Profile',
	components: {
		IonPage, IonContent
	},
	setup(){
		const store = useStore()
		const user = computed(() => store.getters.userMainInfo)

		return {
			user
		}
	}
}
</script>

<style scoped>
@import url(../theme/variables.css);

.blocks-container{
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin: 30px 10px 0 10px;
}

.blocks-container > *{
	background: var(--ion-card-background);
	border-radius: 4px;
	padding: 20px;
}

.main-info-block{
	
	display: flex;
	flex-direction: column;
	gap: 16px;
}
</style>
