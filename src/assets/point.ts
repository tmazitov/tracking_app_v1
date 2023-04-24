import L from 'leaflet'

class Point {
	id:bigint|undefined
	stepId:number
	title:string
	floor:number|undefined
	lat:number
	lon:number

	detailsIsOpen:boolean
	detailsEvent:null|Event
	constructor(pointInfo:any) {
		this.id = pointInfo["id"]
		this.stepId = pointInfo["stepId"]
		this.title = pointInfo["title"] ?? pointInfo["label"]
		this.floor = pointInfo["floor"]
		this.lat = pointInfo["lat"] ?? pointInfo["y"]
		this.lon = pointInfo["lon"] ?? pointInfo["x"]
		this.detailsIsOpen = false
		this.detailsEvent = null
 	}

	copy(){
		return new Point({
			id:this.id,
			title:this.title,
			floor:this.floor,
			lat: this.lat,
			lon: this.lon,
		})
	}

	toLatLng(){
		return L.latLng(this.lat, this.lon)
	}

	toWaypoint(){
		return new L.Routing.Waypoint(this.toLatLng(), this.title, {})
	}
}

export default Point