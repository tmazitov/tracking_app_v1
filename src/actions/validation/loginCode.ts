import { ComponentPublicInstance, ref, Ref } from "vue";
import { IonInputCustomEvent, InputInputEventDetail} from '@ionic/core'

function validateLoginCode(code:string) {
	if (code.length != 6){
		return false;
	}

	const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

	for (let i = 0; i < code.length; i++) {
		if (!digits.includes(code[i])){
			return false;
		}		
	}
	return true;
}

class LoginCodeField {
	input:Ref<string>
	constructor() {
		this.input = ref('')
	}

	el(input:ComponentPublicInstance<HTMLInputElement>|undefined){
		if (!input) return null;
		return input.$el;
	}

	isValid(){
		return validateLoginCode(this.input.value)
	}

	validator(ev:IonInputCustomEvent<InputInputEventDetail>, input:ComponentPublicInstance<HTMLInputElement>|undefined) {
			
		const el = this.el(input);
		if (el == null) return false;

		const value = `${ev.target.value}`;
		el.classList.remove('ion-valid');
		el.classList.remove('ion-invalid');
	
		if (value === '' || this.input.value.length < 6) return;

		validateLoginCode(value)
		? el.classList.add('ion-valid')
		: el.classList.add('ion-invalid');
	}

	markTouched(input:ComponentPublicInstance<HTMLInputElement>|undefined){
		const el = this.el(input);
		if (el == null) return false;

		el.classList.add('ion-touched')
	}
}

export {
	LoginCodeField
}
export default validateLoginCode