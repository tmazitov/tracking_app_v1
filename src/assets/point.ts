class Point {
	id:bigint
	stepId:number
	title:string
	floor:number
	lat:number
	lon:number
	constructor(pointInfo:any) {
		this.id = pointInfo["id"]
		this.stepId = pointInfo["stepId"]
		this.title = pointInfo["title"]
		this.floor = pointInfo["floor"]
		this.lat = pointInfo["lat"]
		this.lon = pointInfo["lon"]
	}
}

export default Point