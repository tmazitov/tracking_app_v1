import { ItemReorderEventDetail } from "@ionic/vue"
import Point from "../point"
import OrderPointsMap from "./index"


class PointsManager {
	map:OrderPointsMap
	constructor(map:OrderPointsMap) {
		this.map = map		
	}

	makePointClone(point:Point){
		let pointCopy:Point = point.copy()
		let place = point.stepId + 1
		this.map.addPoint(pointCopy, place)
		this.closePopover(point)
	}

	removePoint(point: Point){
		this.closePopover(point)
		this.map.removePoint(point)
	}

	focusPoint(point:Point){
		this.map.panTo(point)
		this.map.updateZoom(13)
		this.closePopover(point)
	}

	reorderPoints(ev: CustomEvent<ItemReorderEventDetail>){
		this.map.points.value = ev.detail.complete(this.map.points.value)
		this.map.replacePoints(ev.detail.from, ev.detail.to)
	}

	openPopover(ev:Event, point:Point){
		point.detailsIsOpen = true
		point.detailsEvent = ev
	}

	closePopover(point:Point){
		point.detailsIsOpen = false
		point.detailsEvent = null
	}
}

export default PointsManager