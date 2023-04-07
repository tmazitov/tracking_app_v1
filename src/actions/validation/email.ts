import { ComponentPublicInstance, ref, Ref } from "vue";
import { IonInputCustomEvent, InputInputEventDetail} from '@ionic/core'


function validateEmail(email:string) {
	return email.match(/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
}

class EmailField {
	input:Ref<string>;
	
	constructor() {
		this.input = ref("")
	}

	el(input:ComponentPublicInstance<HTMLInputElement>|undefined){
		if (!input) return null;
		return input.$el;
	}

	isValid(){
		return validateEmail(this.input.value)
	}

	validator(ev:IonInputCustomEvent<InputInputEventDetail>, input:ComponentPublicInstance<HTMLInputElement>|undefined){

		const el = this.el(input);
		if (el == null) return false;

		const value = `${ev.target.value}`;
		el.classList.remove('ion-valid');
		el.classList.remove('ion-invalid');
	
		if (value === '') return false;

		validateEmail(value)
		? el.classList.add('ion-valid')
		: el.classList.add('ion-invalid');

		return true;
	}

	markTouched(input:ComponentPublicInstance<HTMLInputElement>|undefined) {
		const el = this.el(input);
		if (el == null) return;

		el.classList.add('ion-touched');		
	}
}

export {
	EmailField
}
export default validateEmail