import L from 'leaflet'
import {geocoders, Geocoder} from 'leaflet-control-geocoder'
import 'leaflet-routing-machine' // for create the roads between the points
import { reactive, Ref, ref } from 'vue';
import Point from '../point';

interface OrderPointsMapMods {
	isAddNewPoint:boolean
}

class OrderPointsMap {
	mods:OrderPointsMapMods
	instance:L.Map|undefined
	totalTime: Ref<number>
	totalDistance: Ref<number>
	points:Ref<Array<Point>>
	control:L.Routing.Control|undefined
	constructor(points:Array<Point>=[]){
		this.mods = {
			isAddNewPoint: false
		}
		this.points = ref([])
		this.totalTime = ref(0)
		this.totalDistance = ref(0)
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
			console.log('this.mods.isAddNewPoint :>> ', this.mods.isAddNewPoint);
			if (e.waypoints.length > this.points.value.length && e.waypoints.length != 2){
				this.mods.isAddNewPoint = true
			}
			console.log('waypoint changed!!! :>> ', e);
		})
		plan.on('waypointgeocoded', (e:any) => {
			console.log('waypoint geocoded!!! :>> ', e);
			// Add waypoint on the map
			if (this.mods.isAddNewPoint){
				this.mods.isAddNewPoint = false
				let newWaypointIndex:number|undefined = this.checkNewWaypoint(e.waypoint)
				if (newWaypointIndex){
					let point:Point = new Point({
						label: e.waypoint.name,
						x: e.waypoint.latLng.lng,
						y: e.waypoint.latLng.lat,
					})
					this.addPoint(point, e.waypointIndex)
					return
				}
			}

			// Change of position or location name of waypoint
			let replacedPointIndex = e.waypointIndex
			this.points.value[replacedPointIndex].title = e.waypoint.name
			this.points.value[replacedPointIndex].lat = e.waypoint.latLng.lat
			this.points.value[replacedPointIndex].lon = e.waypoint.latLng.lng
		})

		// Init the routing machine control

		this.control = L.Routing.control({
			plan: plan,
			routeWhileDragging: true,
			geocoder: new geocoders.Nominatim({}),
		
		})
		.addTo(this.instance)
		this.control.on('routesfound',  (e:any) => {
			this.totalTime.value = e.routes[0].summary.totalTime;
			this.totalDistance.value = e.routes[0].summary.totalDistance;
			console.log('e.routes[0].summary :>> ', e.routes[0].waypoints);
		})

		// Hide way instructions

		let cont = this.control.getContainer()
		if (!cont) return
		cont.style.display = 'None'
	}
	panTo(point:Point){
		this.instance?.panTo([point.lat, point.lon])
	}
	addPoint(point:Point, place:number|undefined=undefined){
		if (!this.instance) return

		// Add to array of Points
		if (place == undefined){
			point.stepId = this.points.value.length	
			this.points.value.push(point)
		} else {
			point.stepId = place
			this.points.value.splice(place, 0, point)
		}

		// Draw into the map and scale zoom on point
		this.panTo(point)

		// Draw the total road
		this.updatePlan()
	}
	replacePoints(fromIndex:number, toIndex:number){
		let from:Point = this.points.value[fromIndex]
		let to:Point = this.points.value[toIndex]
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
		let current:Array<L.Routing.Waypoint> = this.points.value.map(p => p.toWaypoint())
		this.control.setWaypoints(current)
	}

	private checkNewWaypoint(waypoint:L.Routing.Waypoint):number|undefined{

		let pointIsFound:number|undefined

		if (waypoint.latLng == undefined || waypoint.name == undefined) {
			return undefined
		}
		pointIsFound = this.points.value.findIndex(point => {
			return point.title == waypoint.name
		})
		return pointIsFound
	}
}

export default OrderPointsMap