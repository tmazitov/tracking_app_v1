<template>
	<div class="date__viewer">
		{{ dateString }}
		<a style="color:grey">{{timeString}}</a>
	</div>
</template>

<script lang="ts">
import { ref } from 'vue';

const namesOfWeekDays = [
	'Вс.',
	'Пн.',
	'Вт.',
	'Ср.',
	'Чт.',
	'Пт.',
	'Сб.',
]

const namesOfMonths = [
	'Января',
	'Февраля',
	'Марта',
	'Апреля',
	'Мая',
	'Июня',
	'Июля',
	'Августа',
	'Сентября',
	'Октября',
	'Ноября',
	'Декабря',
]

const getDateString:Function = (date:Date) => {
	
	let month:String = namesOfMonths[date.getMonth()]
	let dayOfWeek:String = namesOfWeekDays[date.getDay()]

	return [dayOfWeek, date.getDate(), month, date.getFullYear()].join(" ")
}

export default {
	name: 'TrackingAppV1DateViewer',
	setup(){		
		const dateString = ref("")
		const timeString = ref("")
		setInterval(() => {
			let date:Date = new Date()
			dateString.value = getDateString(date)
			if (date.getMinutes() > 9){
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
.date__viewer{
	font-size: 24px;
	font-weight: 500;
	margin: 20px;
	width: 280px;
}
</style>