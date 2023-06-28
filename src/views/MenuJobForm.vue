<template>
	<ion-page>
		<ion-content>
			<div class="menu-job-form">
				<UserJobForm/>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import UserJobForm from "../components/forms/user-job-form/UserJobForm.vue"

export default {
	name: "MenuJobForm",
	components: {
		UserJobForm,
		IonPage,
		IonContent,
	}
}
</script>

<style scoped>

</style>