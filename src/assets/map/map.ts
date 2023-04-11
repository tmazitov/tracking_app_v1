import L from 'leaflet'
import {geocoders, Geocoder} from 'leaflet-control-geocoder'
import 'leaflet-routing-machine' // for create the roads between the points
import Point from '../point';

class OrderPointsMap {
	instance:L.Map|undefined
	totalTime: number|undefined
	totalDistance:number|undefined
	points:Array<Point>
	control:L.Routing.Control|undefined
	constructor(points:Array<Point>=[]){
		this.points = points
	}
	setup(center:L.LatLngExpression, zoom:number){
		this.instance = L.map("map").setView(center, zoom);
		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.instance);



		// Init the plan

		const plan = new L.Routing.Plan([], {       
			addWaypoints: true,
			draggableWaypoints: true,   
			geocoder: new geocoders.Nominatim({}),  
		})
		plan.on('waypointschanged', (e:any) => {
			console.log('waypoint changed!!! :>> ', e);
		})
		plan.on('waypointgeocoded', (e:any) => {
			let replacedPointIndex = e.waypointIndex
			this.points[replacedPointIndex].title = e.waypoint.name
			this.points[replacedPointIndex].lat = e.waypoint.latLng.lat
			this.points[replacedPointIndex].lon = e.waypoint.latLng.lng
			console.log('waypoint geocoded!!! :>> ', e);
		})

		// Init the routing machine control

		this.control = L.Routing.control({
			plan: plan,
			routeWhileDragging: true,
			geocoder: new geocoders.Nominatim({}),
		})
		.addTo(this.instance)
		this.control.on('routesfound',  (e:any) => {
			this.totalTime = e.routes[0].summary.totalTime;
			this.totalDistance = e.routes[0].summary.totalDistance;
			console.log('e.routes[0].summary :>> ', e.routes[0].waypoints);
		})
	}
	panTo(point:Point){
		this.instance?.panTo([point.lat, point.lon])
	}
	addPoint(point:Point){
		if (!this.instance) return

		// Add to array of Points
		point.stepId = this.points.length	
		this.points.push(point)

		// Draw into the map and scale zoom on point
		// L.marker([point.lat, point.lon]).addTo(this.instance)
		this.panTo(point)
		// this.updateZoom(13)

		// Draw the total road
		this.updatePlan()

		// Hide the plan of road
		if (!this.control) return
		let cont = this.control.getContainer()
		if (!cont) return
		cont.style.display = 'None'

	}
	replacePoints(fromIndex:number, toIndex:number){
		let from:Point = this.points[fromIndex]
		let to:Point = this.points[toIndex]
		let stepTemp:number|undefined = from.stepId
		from.stepId = to.stepId
		to.stepId = stepTemp

		this.updatePlan()
	}
	updateZoom(zoomLvl:number){
		this.instance?.setZoom(zoomLvl)
	}
	updatePlan(){
		if (!this.control) return
		let current:Array<L.Routing.Waypoint> = this.points.map(p => p.toWaypoint())
		this.control.setWaypoints(current)
	}
}

export default OrderPointsMap