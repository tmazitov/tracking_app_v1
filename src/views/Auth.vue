<template>
	<ion-page>
		<ion-backdrop v-if="data.isSetupUser"></ion-backdrop>
		<div class="auth__page">
			<div class="welcome__container" v-if="data.isSetupUser">
				<ion-title size="large">Первые шаги!</ion-title>
				<div class="fields__container">
					<ion-text class="description">
						Вы удачно создали пользователя и теперь нам нужно понять как к вам обращаться!   
					</ion-text>
					<ion-input type="text" 
						v-model="data.shortName"
						label="Введите ваше имя" 
						label-placement="floating" 
						fill="solid"
						:counter="true" 
						:maxlength="24">
					</ion-input>
				</div>
				<div class="button__container">
					<ion-button expand="block" @click="sendShortName">Отправить</ion-button>
				</div>
			</div>
			<div class="auth__container" v-show="data.isWriteCode">
				<div class="sub__container active">
					<div class="first__form ">
						<ion-title size="large">
							<div class="title__container">
								<ion-icon :icon="arrowBackOutline" @click="changeMode"></ion-icon>
								<div>Код безопасности</div>
							</div>
						</ion-title>
						<div class="fields__container">
							<ion-text class="description">
								Одноразовый код для авторизации был выслан на эл. почту
								<ion-text color="primary">{{emailField.input.value}}</ion-text>.
							</ion-text>
							<ion-input type="text" 
								v-model="codeField.input.value"
								ref="codeRef"
								label="Введите код" 
								label-placement="floating" 
								fill="solid"
								error-text="Неправильный код"
								@ionInput="(ev) => codeField.validator(ev, codeRef)"
								@ionBlur="() => codeField.markTouched(codeRef)">
							</ion-input>
							<ion-text color="primary">
								<div class="repeat" @click="entry">Отправить ещё</div>
							</ion-text>
							
						</div>
						<div class="button__container">
							<ion-button expand="block" @click="sendCode">Войти</ion-button>
						</div>
					</div>
				</div>
				<div class="sub__container">
					<div class="first__form">

					</div>
				</div>
			</div>
			<div class="auth__container"  v-show="!data.isWriteCode">
				<div class="sub__container">
					<div class="second__form">

					</div>
				</div>
				<div class="sub__container active">
					<div class="first__form">
						<ion-title size="large">Авторизация</ion-title>
						<div class="fields__container">
							<ion-text class="description">
								Введите адрес эл. почты чтобы войти в аккаунт или создать новый.
							</ion-text>
							<ion-input type="email" 
								v-model="emailField.input.value"
								ref="emailRef"
								label="Введите aдрес эл. почты" 
								label-placement="floating" 
								fill="solid" 
								error-text="Неправильный адрес эл. почты"
								@ionInput="(ev) => emailField.validator(ev, emailRef)"
								@ionBlur="() => emailField.markTouched(emailRef)">
							</ion-input>
							
						</div>
					</div>
					<div class="button__container">
						<ion-button expand="block" @click="entry">Далее</ion-button>
					</div>
				</div>
			</div>
		</div>
	</ion-page>
</template>

<script lang="ts">
import { ComponentPublicInstance, reactive, ref } from 'vue'
import AuthAPI from '../api/auth/auth'
import { IonContent, IonInput, IonTitle, IonButton, IonText, IonIcon,IonPage, useIonRouter, IonBackdrop} from '@ionic/vue'

import { arrowBackOutline, code } from 'ionicons/icons';

import { EmailField } from '../actions/validation/email'
import { LoginCodeField } from '../actions/validation/loginCode' 
import TMS from '@/api/tms';
import { useStore } from 'vuex';

export default {
	name: "AuthPage",
	components: {
		IonBackdrop,
		IonContent,
		IonInput,
		IonTitle,
		IonText,
		IonButton,
		IonIcon,
		IonPage
	},
	setup(){
		const data = reactive({
			isWriteCode: false,
			isSetupUser: false,
			shortName: "",
		})

		const store = useStore()
		const router = useIonRouter()
		const codeRef = ref<ComponentPublicInstance<HTMLInputElement>>()
		const codeField = new LoginCodeField()

		const emailRef = ref<ComponentPublicInstance<HTMLInputElement>>()
		const emailField = new EmailField()

		const changeMode = () => {
			data.isWriteCode = !data.isWriteCode
		}

		const goBackPage = () => {
			store.dispatch('setup-user')
			if (router.canGoBack()){
				router.back()
			} else {
				router.push('/home')
			}
		}

		const  entry = async () => {

			if (!emailField.isValid()){
				emailField.markTouched(emailRef.value);
				return;
			}

			let err = await AuthAPI.login(emailField.input.value)
			if (err != null){
				throw new Error(err)
			} else {
				if (!data.isWriteCode){
					changeMode()
				}
			}
		}

		const sendShortName = () => {
			TMS.putUserInfo(data.shortName).then(response => {
				if (response.data && response.data["err"] != null){
					throw response.data["err"]
				}

				goBackPage()
			})
		}

		const sendCode = async () => {
			if (!codeField.isValid()){
				codeField.markTouched(codeRef.value)
				return
			}

			let err = await AuthAPI.sendCode(codeField.input.value)
			if (err != null){
				throw new Error(err)
			} 
			
			TMS.getUserInfo().then(userInfo => {
				if (userInfo.data && userInfo.data["err"] != null){
					throw userInfo.data["err"]
				}
				console.log('userInfo.data["shortName"] :>> ', userInfo.data["shortName"]);
				data.isSetupUser = userInfo.data["shortName"] == ""
				if (data.isSetupUser == false){
					goBackPage()
				}
			})
		}

		return {
			data,
			arrowBackOutline: arrowBackOutline,
			entry,
			sendCode,
			sendShortName,
			changeMode,

			codeRef,
			codeField,

			emailRef,
			emailField,
		}
	}
}
</script>

<style scoped>

.auth__page {
	width: 100vw;
	height: 100vh;

	display: flex;
	justify-content: center;
	align-items: center;
}
.auth__container{
	width: 750px;
	height: 450px;

	background: #1e2023;

	border-radius: 8px;

	display: grid;
	grid-template-columns: 50% 50%;
	overflow: hidden;
}

.sub__container{
	padding: 10px;
	position: relative;
}

.sub__container.active{
	background: #383a3e;
	padding: 24px;
	border-radius: 8px;
}

.fields__container{
	display: flex;
	flex-direction: column;
	gap: 16px;
}

ion-title.title-large {
	font-size: 24px;
	padding: 0;
	margin: 16px 0;
	margin-bottom: 30px;
}

.input-wrapper.sc-ion-input-md {
	background: var();
}

.repeat{
	cursor: pointer;
	font-size: 12px;
}

.description{
	font-size: 14px;
}
.repeat:hover{
	text-decoration: underline;
}

.button__container{
	position: absolute;
	bottom: 34px;
	width: calc(100% - 24px * 2);
}

.title__container{
	display: flex;
	flex-direction: row;
	gap: 16px;
}

ion-backdrop {
	opacity: 0.7;
	background: #242424;
	z-index: 3;
	display: flex;
	justify-content: center;
	align-items: center;
}

.welcome__container {
	z-index: 4;
	position: absolute;

	padding: 24px;

	width: 375px;
    height: 500px;
	background: #383a3e;
	border-radius: 8px;
}


@media (max-width:768px) {
	.auth__container{
		grid-template-columns: 100%;
	}
	.sub__container.active{
		height: inherit;
		margin: 0 10px;
	}

	.sub__container{ 
		padding: 0;
	}
}
</style>