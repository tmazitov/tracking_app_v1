import SelectableItem from "./selectableItem"

const USER_ROLE_NAMES:{ [key: number]: string; }  = {
	0 : "Пользователь",
	1 : "Водитель",
	2 : "Менеджер",
	3 : "Админ",
}

class User {
	id:number
	shortName:string
	roleId:number

	title:string
	value:number
	
	state:UserState

	constructor(userData:any) {
		this.id = userData["id"]
		this.value = this.id 
		this.shortName = userData["shortName"]
		this.title = this.shortName
		this.roleId = userData["roleId"]
		this.state = new UserState()
	}

	getRoleName(){
		return USER_ROLE_NAMES[this.roleId]
	}

	toSelectableItem():SelectableItem{
		return { 
			title: this.shortName,
			value: this.id,
		}
	}
}

class UserState {
	detailsIsOpen:boolean=false
}

export default User