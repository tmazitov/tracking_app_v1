class UserJobForm {
	jobType:number = -1
	jobExperience:number = 0
	jobMail:string = ""

	isValid(){
		return this.jobType != -1
	}

	toSubmit(){
		return {
			jobType: this.jobType,
			jobMail: this.jobMail,
			jobExperience: this.jobExperience,
		}
	}
}

export default UserJobForm