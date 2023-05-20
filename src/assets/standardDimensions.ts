function toKM(meters:number){
	return `${Math.round(meters / 1000)} км`
}

function convertSeconds(sec:number) {
	var days = Math.floor(sec / (3600 * 24));
	var hours = Math.floor((sec % (3600 * 24)) / 3600);
	var minutes = Math.floor((sec % 3600) / 60);
	
	return {
	  "days": days,
	  "hours": hours,
	  "minutes": minutes
	};
}

function toTimeString(seconds: number){
	let time = convertSeconds(seconds)
	let totalString = ""
	if (time.days != 0) totalString += `${time.days} д. `
	if (time.hours != 0) totalString += `${time.hours} ч. `
	if (time.minutes != 0) totalString += `${time.minutes} мин. `

	return totalString
}

let vw:number = Number((Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100).toFixed(3))
var vh:number = Number((Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 100).toFixed(3))

export {
	toKM,
	toTimeString,
	vh as cssVh, vw as cssVw
}