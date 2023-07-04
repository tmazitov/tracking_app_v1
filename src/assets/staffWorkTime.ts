import { convertHHMMToMinutes, convertMinutesToHHMM } from "./date"

class StaffWorkTime {
	startAt:string
	endAt:string
	constructor(params:any) {
		this.startAt = convertMinutesToHHMM(params["startAt"])
		this.endAt = convertMinutesToHHMM(params["endAt"])	
	}
	
	isEqual(workTime:StaffWorkTime):boolean {
		return this.startAt == workTime.startAt && this.endAt == workTime.endAt
	}

	toSubmit(){
		return {
			startAt: convertHHMMToMinutes(this.startAt), 
			endAt: convertHHMMToMinutes(this.endAt), 
		}
	}

	range() {
		const start = new Date(`2000-01-01T${this.startAt}`);
		const end = new Date(`2000-01-01T${this.endAt}`);
		
		const timeRange = [];
		let currentTime = start;
	  
		while (currentTime <= end) {
		  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		  timeRange.push(formattedTime);
		  currentTime.setHours(currentTime.getHours() + 1);
		}
		
		return timeRange;
	}

	includes(time:string):number {
		var currentTime = new Date("1970-01-01 " + time);
		var startTimeObj = new Date("1970-01-01 " + this.startAt);
		var endTimeObj = new Date("1970-01-01 " + this.endAt);
		if (currentTime < startTimeObj) return -1
		if (currentTime > endTimeObj) return 1
		return 0
	}

	startHour(){
		return Number(this.startAt.split(":")[0])
	}

	endHour(){
		return Number(this.endAt.split(":")[0])
	}
}

export default StaffWorkTime