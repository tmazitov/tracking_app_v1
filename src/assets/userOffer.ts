class UserOffer {
	id:number
	userId:number
	jobType:number
	jobExperience:number
	jobMail:string|undefined
	constructor(params:any) {
		this.id = params["id"]
		this.userId = params["userId"]
		this.jobType = params["jobType"]
		this.jobExperience = params["jobExperience"]
		this.jobMail = params["jobMail"]
	}

	getTitle(){
		return `Заявка №${this.id}`
	}	

	getJobType(){
		if (this.jobType == 1) return "Водитель" 
		if (this.jobType == 2) return "Менеджер"
	}

	getJobExpString(){
		let years = this.jobExperience
		if (years === 1 || (years > 20 && years % 10 === 1)) {
			return `${years} год`;
		}
		if ((years >= 2 && years <= 4) || (years > 20 && years % 10 >= 2 && years % 10 <= 4)) {
			return `${years} года`;
		} 
		return `${years} лет`;
	}
}

export default UserOffer