<template>
	<ion-page class="settings-page">
		<ion-tabs>
			<ion-header>
				<ion-toolbar class="toolbar">
					<ion-icon @click="goToMenu()" slot="start" :icon="arrowBackOutline"></ion-icon>
					<div class="toolbar-wrapper">
						<ion-title>{{pageTitle}}</ion-title>
					</div>
				</ion-toolbar>
			</ion-header>
	
			<ion-router-outlet class="content"></ion-router-outlet>
		</ion-tabs>
	</ion-page>
</template>

<script lang="ts">
import { IonTitle, IonToolbar, IonHeader, IonRouterOutlet, IonPage, IonTabs, IonIcon } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
	name: "SettingsPage",
	components: {
		IonTitle,
		IonToolbar,
		IonHeader,
		IonRouterOutlet,
		IonTabs,
		IonPage,
		IonIcon,
	},
	setup(){
		const router = useRouter()
		const pageTitle = computed(() => {
			let currentRouteName = router.currentRoute.value.name
			if (currentRouteName == "settings-workers") return "Рабочие"
			if (currentRouteName == "settings-job") return "Работа"
			if (currentRouteName == "settings-job-form") return "Заявка на работу"
		})

		const goToMenu = () => {
			router.push({name:"menu"})
		}

		return {
			pageTitle,
			arrowBackOutline,
			goToMenu
		}
	}	
}
</script>

<style scoped>
.content{  
	min-width: 320px;
	max-width: 660px;

    overflow-y: auto;
	height: 100%;
	width: 100%;
}

.content > .ion-page > * > * {
    margin: 0 20px;
}

.content > * {
    overflow-y: hidden;
}

.toolbar{
	padding: 0 16px;
}

@media (max-width: 768px){
    .toolbar-wrapper{
        width: 100vw;
    }
	.content {
		width: calc(100% - 20px);
		margin: 10px;
		height: calc(100% - 20px);
	}
    .tab-bar-wrapper{
        display: none;
    }

    .tab-wrapper-smartphone{
        display: flex;
    }
}
@media (min-width: 768px){
    .toolbar-wrapper{
        width: 60vw;
    }
	.content {
		width: 60vw;
		margin: 0 auto;
	}

    .tab-bar-wrapper{
        display: flex;
    }

    .tab-wrapper-smartphone{
        display: none;
    }
}
</style>