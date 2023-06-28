<template>
	<ion-page>
		<ion-content  :fullscreen="true">
			<div class="blocks-container">
				<div class="main-info-block">
					<div class="title">{{ user.shortName }}</div>
					<div class="role">{{ user.getRoleName()}}</div>
				</div>
	
				<ion-list class="settings">
					<ion-item @click="staticClickHandler(item.path)" v-for="item, index in getSettingsList()" :key="`setting-${index}`" :detail="true" lines="full"> 
						<ion-icon :icon="item.icon" slot="start" size="small"></ion-icon>
						<ion-label>{{item.title}}</ion-label>
					</ion-item>
					<ion-item lines="full"> 
						<ion-icon :icon="exitOutline" slot="start" size="small" color="danger"></ion-icon>
						<ion-label color="danger">Выйти</ion-label>
					</ion-item>
				</ion-list>	

				<ion-toast 
				:is-open="data.toastInDevIsOpen"
				color="warning"
				message="В разработке" 
				:duration="3000" 
				:icon="buildOutline"
				@didDismiss="data.toastInDevIsOpen = false">
				</ion-toast>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import User from '@/assets/user';
import { IonPage, IonContent, IonItem, IonList, IonIcon, IonLabel, IonToast } from '@ionic/vue';
import { briefcaseOutline, buildOutline, cashOutline, documentTextOutline, exitOutline, peopleOutline, settingsOutline, statsChartOutline } from 'ionicons/icons';
import { ComputedRef, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

interface SettingsItem {
	title: string
	path: string
	icon: string
}

export default {
	name: 'Menu',
	components: {
		IonPage, IonContent, IonList, IonItem, IonIcon, IonLabel, IonToast,
	},
	setup(){
		const store = useStore()
		const router = useRouter()
		const user:ComputedRef<User> = computed(() => store.getters.userMainInfo)

		const adminSettings:Array<SettingsItem> = [
			{title: "Общие настройки",	path: "settings-main",			icon: settingsOutline},
			{title: "Настройки цен",	path: "settings-prices",		icon: cashOutline},
			{title: "Работники",		path: "settings-workers",		icon: peopleOutline},
			{title: "Документы",		path: "settings-documents",	icon: documentTextOutline},
			{title: "Статистика",		path: "settings-statistics",	icon: statsChartOutline},
		]		

		const defaultSettings:Array<SettingsItem> = [
			{title: "Общие настройки",	path: "settings-main",			icon: settingsOutline},
			{title: "Документы",		path: "settings-documents",		icon: documentTextOutline},
			{title: "Статистика",		path: "settings-statistics",	icon: statsChartOutline},
		]	

		const baseSettings:Array<SettingsItem> = [
			{title: "Общие настройки",	path: "settings-main",			icon: settingsOutline},
			{title: "Работа",			path: "settings-job",			icon: briefcaseOutline},
		]	

		const data = reactive({
			toastInDevIsOpen: false
		})

		const getSettingsList = () => {
			if (user.value.roleId == 3) return adminSettings
			if (user.value.roleId == 0) return baseSettings
			return defaultSettings
		}


		const staticClickHandler = (routeName:string) => {
			
			if (router.hasRoute(routeName)) {
				router.push({name:routeName})
			} else {
				data.toastInDevIsOpen = true
			}
		}

		return {
			user,
			data,
			staticClickHandler,
			getSettingsList,
			buildOutline,
			exitOutline, 
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
}

.main-info-block{
	padding: 15px;
	
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 16px;
}

.main-info-block > .title{
	font-size: 20px;
}

.main-info-block > .role {
	font-size: 14px;
	color: var(--ion-color-step-450);
}
</style>
