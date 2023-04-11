import L from 'leaflet'

class Point {
	id:bigint|undefined
	stepId:number
	title:string
	floor:number|undefined
	lat:number
	lon:number
	constructor(pointInfo:any) {
		this.id = pointInfo["id"]
		this.stepId = pointInfo["stepId"]
		this.title = pointInfo["title"] ?? pointInfo["label"]
		this.floor = pointInfo["floor"]
		this.lat = pointInfo["lat"] ?? pointInfo["y"]
		this.lon = pointInfo["lon"] ?? pointInfo["x"]
 	}

	toLatLng(){
		return L.latLng(this.lat, this.lon)
	}

	toWaypoint(){
		return new L.Routing.Waypoint(this.toLatLng(), this.title, {})
	}
}

export default Point