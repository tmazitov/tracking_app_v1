import { FieldContext } from "vee-validate";

interface IOrderCreateFields {
	title: FieldContext<string>;
	date: FieldContext<string>;
	start: FieldContext<string>;
	duration: FieldContext<number>;
	comment: FieldContext<string>;
	currentOrderType: FieldContext<Array<number>>;
	isRegularCustomer: FieldContext<boolean>;
}

export default IOrderCreateFields;
