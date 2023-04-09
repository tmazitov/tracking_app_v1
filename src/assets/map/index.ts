import L from 'leaflet'
import Point from './point';


class LMap {
	instance:L.Map|undefined
	constructor(){}
	setup(center:L.LatLngExpression, zoom:number){
		this.instance = L.map("map").setView(center, zoom);
		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.instance)
	}
	panTo(point:Point){
		this.instance?.panTo([point.lat, point.lon])
	}
	addPoint(point:Point){
		if (!this.instance) return

		L.marker([point.lat, point.lon]).addTo(this.instance)
		this.panTo(point)
		this.updateZoom(13)
	}
	updateZoom(zoomLvl:number){
		this.instance?.setZoom(zoomLvl)
	}
}

export default LMap