import L from 'leaflet'
import * as yup from "yup"

class Point {
	id:bigint|undefined
	stepId:number
	title:string
	floor:number|undefined
	lat:number
	lon:number

	searchQuery:string|undefined
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
		this.searchQuery = pointInfo["searchQuery"]
 	}

	copy(){
		return new Point({
			id:this.id,
			title:this.title,
			floor:this.floor,
			lat: this.lat,
			lon: this.lon,
			searchQuery: this.searchQuery,
		})
	}

	update(payload:Point){
		this.title = payload.title
		this.lat = payload.lat
		this.lon = payload.lon
	}

	toLatLng(){
		return L.latLng(this.lat, this.lon)
	}

	toWaypoint(){
		return new L.Routing.Waypoint(this.toLatLng(), this.title, {})
	}

	static toYup(){
		return yup.object({
			title: yup.string().required(),
			lat: yup.number().required(),
			lon: yup.number().required(),
		})
	}
}

export default Point