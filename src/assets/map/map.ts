import L from 'leaflet'
import {geocoders} from 'leaflet-control-geocoder' // for geocoding of new points
import 'leaflet-routing-machine' // for create the roads between the points
import {Ref, ref } from 'vue'; 
import Point from '../point';
import { calculateCenterAndZoom } from './calculations';

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
	constructor(){
		this.mods = {
			isAddNewPoint: false
		}
		this.points = ref([])
		this.totalTime = ref(0)
		this.totalDistance = ref(0)
	}
	setup(uid:number, center:L.LatLngExpression, zoom:number, points:Array<Point>=[]){
		this.points.value = points
		console.log('uid :>> ', uid);
		this.instance = L.map(`map-${uid}`).setView(center, zoom);
		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.instance);

		// Init the plan

		const plan = new L.Routing.Plan(this.points.value.map(point => point.toWaypoint()), {       
			addWaypoints: true,
			draggableWaypoints: true,   
			geocoder: new geocoders.Nominatim({}),  
			createMarker: this.createMarker,
			dragStyles: [
				{color: 'black', opacity: 0.15, weight: 7},
				{color: 'white', opacity: 0.8, weight: 4},
				{color: '#3880ff', opacity: 1, weight: 2, dashArray: '7,12'}
			]
		})
		plan.on('waypointschanged', (e:any) => {this.waypointChangedEventHandler(e)})
		plan.on('waypointgeocoded', (e:any) => {this.waypointGeocodedEventHandler(e)})

		// Init the routing machine control

		this.control = L.Routing.control({
			plan: plan,
			routeWhileDragging: true,
			geocoder: new geocoders.Nominatim({}),
			lineOptions: {
				styles:[
					{color: 'black', opacity: 0.15, weight: 7},
					{color: 'white', opacity: 0.8, weight: 4},
					{color: '#3880ff', opacity: 1, weight: 2}
				],
				extendToWaypoints: false,
				missingRouteTolerance: 0,
			}
		})
		.addTo(this.instance)
		this.control.on('routesfound',  (e:any) => {
			this.totalTime.value = e.routes[0].summary.totalTime;
			this.totalDistance.value = e.routes[0].summary.totalDistance;
			console.log('e.routes[0].summary :>> ', e.routes[0].waypoints);
		})

		if (this.points.value.length > 0){
			let mapProps = calculateCenterAndZoom(this.instance, this.points.value)
			this.instance.setView(mapProps.center.toLatLng(), mapProps.zoom)			
		}
		
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

	updatePoint(point:Point, payload:Point){
		point.update(payload)
		this.panTo(point)
		this.updatePlan()
	}

	removePoint(point:Point) {
		this.points.value = this.points.value.filter((p:Point) => point !== p)
		this.updatePlan()
	}

	updateZoom(zoomLvl:number){
		this.instance?.setZoom(zoomLvl)
	}
	private updatePlan(){
		if (!this.control) return
		let current:Array<L.Routing.Waypoint> = this.points.value.map(p => p.toWaypoint())
		this.control.setWaypoints(current)
	}

	private createMarker(waypointIndex: number, waypoint: L.Routing.Waypoint, waypointsCount: number):L.Marker{
		let iconSetting:L.IconOptions = {
			iconUrl: "",
			iconSize: [24, 24],
			iconAnchor: undefined,			
		}
		if (waypointIndex == 0){ // start point marker 
			iconSetting.iconUrl = "ellipse-outline.svg"
		} else if (waypointIndex == waypointsCount - 1) { // end point marker
			iconSetting.iconUrl = "square-outline.svg"
		} else { // other points
			iconSetting.iconUrl = "flag-outline.svg"
			iconSetting.iconAnchor = [0, 24]
		}
		let icon:L.Icon = new L.Icon(iconSetting)
		return new L.Marker(waypoint.latLng, {
			draggable: true,
			autoPanOnFocus: true,
			title: waypoint.name,
			icon: icon,
		})
	}

	private waypointGeocodedEventHandler(e:L.Routing.GeocodingEvent){
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
		this.points.value[replacedPointIndex].title = e.waypoint.name ?? ""
		this.points.value[replacedPointIndex].lat = e.waypoint.latLng.lat
		this.points.value[replacedPointIndex].lon = e.waypoint.latLng.lng
	}

	private waypointChangedEventHandler(e:L.Routing.RoutingEvent){
		if (e.waypoints.length > this.points.value.length && e.waypoints.length != 2){
			this.mods.isAddNewPoint = true
		}
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