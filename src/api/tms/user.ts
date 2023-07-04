import { yyyymmdd } from "@/assets/date";
import UserJobForm from "@/components/forms/user-job-form/instance";
import tmsClient from "./client";

class User {
	static getStaffList(){
		return tmsClient.get('/staff')
	}

	static getStaffWorkTime(){
		return tmsClient.get('/staff/work-time')
	}

	static holidayCreate(workerId:number, date:Date){
		return tmsClient.get(`/user/${workerId}/holiday?d=${yyyymmdd(date)}`)	
	}

	static holidayList(date:Date){ 
		return tmsClient.get(`/holiday-list?d=${yyyymmdd(date)}`)	
	}

	static holidayDelete(workerId:number, date:Date){
		return tmsClient.delete(`/user/${workerId}/holiday?d=${yyyymmdd(date)}`)	
	}

	static offerSubmit(form:UserJobForm){
		return tmsClient.post(`/user/offer`, form)	
	}

	static offerGet() {
		return tmsClient.get(`/user/offer`)
	}
}

export default User