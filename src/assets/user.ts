import SelectableItem from "./selectableItem"

class User {
	id:number
	shortName:string
	roleId:number
	
	constructor(id:number, name:string, roleId:number) {
		this.id = id
		this.shortName = name
		this.roleId = roleId
	}

	toSelectableItem():SelectableItem{
		return { 
			title: this.shortName,
			value: this.id,
		}
	}
}

export default User