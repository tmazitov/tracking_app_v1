import TMS from "@/api/tms";
import OrderPriceList from "@/assets/orderPriceList";
import StaffWorkTime from "@/assets/staffWorkTime";
import { Field } from "vee-validate";
import IOrderCreateFields from "./fields";

function loadPriceList(data: { priceList: OrderPriceList|null }, fields: IOrderCreateFields) {
	return TMS.order()
		.priceList()
		.then((response) => {
			if (!response.data) 
				return
			if (response.data.err) 
				throw response.data.err

			data.priceList = new OrderPriceList(response.data);
			fields.duration.setValue(data.priceList.bigCarTime);
		});
}

function loadWorkTime(data: { staffWorkTime: StaffWorkTime|null }, fields: IOrderCreateFields) {
	return TMS.user()
		.getStaffWorkTime()
		.then(response => {
			if (!response.data) 
				return
			if (response.data.err) 
				throw response.data.err;

			data.staffWorkTime = new StaffWorkTime(response.data);
			fields.start.setValue(data.staffWorkTime.startAt);
		});
}

export {
	loadPriceList,
	loadWorkTime
}