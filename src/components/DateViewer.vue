<template>
	<div class="date__viewer">
		{{ dateString }}
	</div>
</template>

<script lang="ts">
import { ref } from 'vue';

const namesOfWeekDays = [
	'Пн.',
	'Вт.',
	'Ср.',
	'Чт.',
	'Пт.',
	'Сб.',
	'Вс.',
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
		setInterval(() => {
			dateString.value = getDateString(new Date())
			console.log('dateString.value :>> ', dateString.value);
		}, 1000)

		return {
			dateString : dateString
		}
	}
};
</script>

<style scoped>
.date__viewer{
	font-size: 28px;
	font-weight: 500;
	margin: 20px;
}
</style>