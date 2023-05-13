function yyyymmdd(date:Date) {
	var mm = date.getMonth() + 1; // getMonth() is zero-based
	var dd = date.getDate();
  
	return [date.getFullYear(),
			(mm>9 ? '' : '0') + mm,
			(dd>9 ? '' : '0') + dd
		   ].join('-');
}

const namesOfWeekDays = [
	'вс.',
	'пн.',
	'вт.',
	'ср.',
	'чт.',
	'пт.',
	'сб.',
]

const namesOfMonths = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
]

function checkDate(date:Date) {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return "Сегодня";
	} else if (date.toDateString() === tomorrow.toDateString()) {
		return "Завтра";
	} else if (date.toDateString() === yesterday.toDateString()) {
		return "Вчера";
	} else {
		return -1;
	}
}

const getDateString: Function = (date: Date) => {

	let month: String = namesOfMonths[date.getMonth()]
	let dayOfWeek: String = namesOfWeekDays[date.getDay()]

	return [dayOfWeek, date.getDate(), month].join(" ")
}

const getTimeString: Function = (date: Date) => {
	let minuteString: string = ""
	let minute: number = date.getMinutes()
	let hours: number = date.getHours()

	if (minute < 10) minuteString = "0" + minute
	else minuteString = "" + minute

	return `${hours}:${minuteString}`
}


export {
	yyyymmdd,
	namesOfMonths,
	namesOfWeekDays,
	checkDate,
	getDateString,
	getTimeString,
}
