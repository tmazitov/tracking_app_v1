<template>
	<div class="date__viewer">
		{{ dateString }}
		<a style="color:grey">{{ timeString }}</a>
	</div>
</template>

<script lang="ts">
import { ref } from 'vue';

const namesOfWeekDays = [
	'вс.',
	'пн.',
	'вт.',
	'ср.',
	'чт.',
	'пт.',
	'сб.',
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

const getDateString: Function = (date: Date) => {

	let month: String = namesOfMonths[date.getMonth()]
	let dayOfWeek: String = namesOfWeekDays[date.getDay()]

	return [dayOfWeek, date.getDate(), month, date.getFullYear()].join(" ")
}

export default {
	name: 'TrackingAppV1DateViewer',
	props: {
		date: {
			type: Date,
			required: true,
		}
	},
	setup(props) {
		const dateString = ref("")
		const timeString = ref("")
		setInterval(() => {
			let date: Date = props.date

			let dateType = checkDate(date)
			if (dateType != -1){
				dateString.value = dateType + " " + getDateString(date)
			}
			else {
				dateString.value = getDateString(date)
			}
			if (date.getMinutes() > 9) {
				timeString.value = `${date.getHours()}:${date.getMinutes()}`
			} else {
				timeString.value = `${date.getHours()}:0${date.getMinutes()}`
			}

		}, 1000)


		return {
			dateString,
			timeString,
		}
	}
};
</script>

<style scoped>
.date__viewer {
	font-size: 18px;
	font-weight: 500;
	margin: 10px;
	width: calc(100% - 20px);
}
</style>