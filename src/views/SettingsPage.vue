<template>
	<ion-page class="settings-page">
		<ion-tabs>

			<transition name="header">
				<ion-header v-if="isShowHeader">
					<ion-toolbar class="toolbar">
						<ion-icon @click="goToMenu()" slot="start" :icon="arrowBackOutline"></ion-icon>
						<div class="toolbar-wrapper">
							<ion-title>{{pageTitle}}</ion-title>
						</div>
					</ion-toolbar>
				</ion-header>
			</transition>

			<ion-router-outlet class="content"></ion-router-outlet>
		</ion-tabs>
	</ion-page>
</template>

<script lang="ts">
import { IonTitle, IonToolbar, IonHeader, IonRouterOutlet, IonPage, IonTabs, IonIcon } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

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
		const store = useStore()
		const router = useRouter()
		const isShowHeader = computed(() => store.getters.isShowHeader)
		const pageTitle = computed(() => {
			let currentRouteName = router.currentRoute.value.name
			if (currentRouteName == "settings-workers") return "Персонал"
			if (currentRouteName == "settings-job") return "Работа"
			if (currentRouteName == "settings-history") return "Мои заказы"
			if (currentRouteName == "settings-prices") return "Настройки цен"
			if (currentRouteName == "settings-job-form") return "Заявка на работу"
		})

		const goToMenu = () => {
			router.push({name:"menu"})
		}

		return {
			isShowHeader,
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

.header-enter-active{
	animation: header .2s ease-in;
}
.header-leave-active{
	animation: header .2s ease-out reverse;
}

@keyframes header {
	from{
		max-height: 0;
		opacity: 0.4;
	}
	to{
		max-height: 56px;
		opacity: 1;
	}
}
</style>