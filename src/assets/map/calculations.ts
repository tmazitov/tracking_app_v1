import { sum } from "../array";
import Point from "../point";

function calculateZoomScale(map:L.Map, maxLength:number) {
	const earthRadius = 6378137; // средний радиус Земли в метрах
	const pixelBounds = map.getPixelBounds(); // границы пикселей карты
	const mapSize = map.getSize(); // размер контейнера карты
  
	// вычисляем метры на пиксель на текущем масштабе
	const metersPerPixel = maxLength / Math.max(mapSize.x, mapSize.y);
  
	// вычисляем длину контейнера карты в метрах
	const containerLengthInMeters = earthRadius * 2 * Math.PI * Math.cos(map.getCenter().lat * Math.PI / 180);
  
	// вычисляем масштаб увеличения
	const zoomScale = Math.log2(containerLengthInMeters / (metersPerPixel * pixelBounds.getSize().y));
  
	return zoomScale;
  }

function calculateCenterAndZoom(map:L.Map, points:Array<Point>) {
	
	// Find the average coordinate
	const center = new Point({
		label: "center",
		lat: sum(points.map((p:Point) => p.lat)) / points.length, 
		lon: sum(points.map((p:Point) => p.lon)) / points.length
	})

	// Calculate the scale

	let maxLineLength:number = 0
	points.forEach((point:Point) => {
		let length:number = map.distance(center.toLatLng(), point.toLatLng())
		if (length > maxLineLength) {
			maxLineLength = length
		}
	})

	const scale = calculateZoomScale(map, maxLineLength)
	
	// Create a new array with the central coordinate and scale
	
	return {
		center: center,
		zoom: scale - 2,
	}	
}

export {
	calculateCenterAndZoom
}