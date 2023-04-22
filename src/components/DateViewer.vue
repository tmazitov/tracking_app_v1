<template>
	<div class="date__viewer">
		<div>{{ dateString }}</div>
		<div style="color:grey" v-if="dateType == 'Сегодня'">{{ timeString }}</div>
		<div class="calendar-container">
			<ion-icon :icon="calendarOutline" size="large" color="primary" @click="openDatePicker"></ion-icon>
		</div>
		<ion-datetime presentation="date" :value="date" v-show="datePickerIsOpen" @ionChange="selectDate"></ion-datetime>
	</div>
</template>

<script lang="ts">
import { yyyymmdd } from '@/assets/date';
import { IonDatetime, IonIcon } from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';
import { computed, ref } from 'vue';

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
	components: {
		IonDatetime,
		IonIcon
	},
	emits:['update:date'],
	props: {
		date: {
			type: Date,
			required: true,
		}
	},
	setup(props, ctx) {
		const dateString = ref("")
		const datePickerIsOpen = ref(false)
		const timeString = ref("")
		const dateType = ref<string|number>("Сегодня")

		setInterval(() => {
			let date: Date = props.date

			dateType.value = checkDate(date)
			if (dateType.value != -1){
				dateString.value = dateType.value + " " + getDateString(date)
			} else {
				dateString.value = getDateString(date)
			}

			if (dateType.value.toString() == "Сегодня"){
				console.log('date is updated :>> ')
				ctx.emit("update:date", new Date())
			}

			if (date.getMinutes() > 9) {
				timeString.value = `${date.getHours()}:${date.getMinutes()}`
			} else {
				timeString.value = `${date.getHours()}:0${date.getMinutes()}`
			}
		}, 1000)

		const openDatePicker = () => {
			datePickerIsOpen.value = !datePickerIsOpen.value
		}

		const selectDate = (ev:any) => {
			ctx.emit('update:date', new Date(ev.detail.value))
			closeDatePicker()	
		}

		const closeDatePicker = () => {
			datePickerIsOpen.value = false
		}

		const date = computed(() => yyyymmdd(props.date))

		return {
			openDatePicker,
			closeDatePicker,
			dateString,
			selectDate,
			dateType,
			date,
			timeString,
			datePickerIsOpen,
			calendarOutline
		}
	}
};
</script>

<style scoped>
.date__viewer {
	font-size: 18px;
	font-weight: 500;
	padding: 10px;
	width: calc(100% - 20px);

	display: flex;
	flex-direction: row;
	gap: 16px;
}

.calendar-container{
	position: relative;
}

.date__viewer > ion-datetime {
	position: absolute;
	top: 40px;
	left: 10px;
	z-index: 3;
}

@media (min-width: 768px) {
	.date__viewer{
		padding-top: 40px;
	}

	.date__viewer > ion-datetime{
		top: 80px;
		left: 0;
	}
}

@media (max-width: 768px) {
	.date__viewer{
		padding-top: 30px;
	}
}

ion-icon{
	height: 20px;
	width: 20px;
}
</style>