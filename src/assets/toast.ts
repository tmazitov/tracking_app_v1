import { toastController } from "@ionic/vue"
import { closeOutline, checkmarkCircleOutline, closeCircleOutline } from "ionicons/icons"

const TOAST_DURATION = 5000

function makeToast(message:string, color:string, icon:string){
	return toastController.create({
		message: message,
		duration: TOAST_DURATION,
		color: color,
		layout: "baseline",
		position: "top",
		buttons: [
			{
				role: 'cancel',
				icon: closeOutline,
			},
		],
		icon: icon,
	})
}

function makeSuccessToast(message:string){
	return makeToast(message, "success", checkmarkCircleOutline)
}

function makeErrorToast(message:string){
	return makeToast(message, "danger", closeCircleOutline)
}

export {
	makeSuccessToast,
	makeErrorToast,
}