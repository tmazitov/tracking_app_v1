<template>
	<div class="date__viewer">
		<div class="date__arrow-back" @click="()=>plusDate(-1)">
			<ion-icon :icon="chevronBackOutline" ></ion-icon>
		</div>
		<div class="date__datetime">
			<div>{{ dateViewString }}</div>
			<div class="calendar-container">
				<ion-icon :icon="calendarOutline" size="large" color="primary" @click="openDatePicker"></ion-icon>
			</div>
			<transition name="datetime">
				<ion-datetime presentation="date" :value="dateFormatString" v-if="datePickerIsOpen" @ionChange="selectDate"></ion-datetime>
			</transition>
		</div>
		<div class="date__arrow-next" @click="()=>plusDate(1)">
			<ion-icon :icon="chevronForwardOutline" ></ion-icon>
		</div>
	</div>
</template>

<script lang="ts">
import { checkDate, getDateString, namesOfMonths, namesOfWeekDays, yyyymmdd } from '@/assets/date';
import { IonDatetime, IonIcon } from '@ionic/vue';
import { calendarOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { computed, ref } from 'vue';

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
		const datePickerIsOpen = ref(false)
		const dateType = ref<string|number>("Сегодня")

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

		const dateFormatString = computed(() => yyyymmdd(props.date))
		const dateViewString = computed(() => {
			let date: Date = props.date

			dateType.value = checkDate(date)
			if (dateType.value != -1){
				return dateType.value + " " + getDateString(date)
			} else {
				return getDateString(date)
			}
		})

		const plusDate = (plus:number) => {
			let date: Date = new Date(props.date.getTime())
			date.setDate(date.getDate() + plus)
			ctx.emit('update:date', date)
		}
  
		return {
			openDatePicker,
			closeDatePicker,
			selectDate,
			dateType,
			dateFormatString,
			datePickerIsOpen,
			calendarOutline,
			chevronBackOutline,
			chevronForwardOutline,
			plusDate,
			dateViewString,
		}
	}
};
</script>

<style scoped>
.date__viewer {
	display: grid;
	grid-template-columns: 20px calc(100% - 16px - 20px - 16px - 20px) 16px;
	grid-column-gap: 16px;
	padding-bottom: 16px;
	border-bottom: 1px solid grey;
}

.date__datetime{
	font-size: 18px;
	font-weight: 500;

	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 16px;
}

.calendar-container{
	position: relative;
}

.date__datetime > ion-datetime {
	position: absolute;
	top: 40px;
	left: 10px;
	z-index: 3;
}

@media (min-width: 768px) {
	.date__viewer{
		padding-top: 40px;
	}

	.date__datetime > ion-datetime{
		top: 80px;
		left: calc(50% - 175px);
	}
}

@media (max-width: 768px) {
	.date__viewer{
		padding-top: 24px;
	}
	.date__datetime > ion-datetime{
		top: 80px;
		left: 10px;
		max-width: 400px;
		width: calc(100% - 20px);
	}
}

ion-icon{
	height: 20px;
	width: 20px;
}


.datetime-enter-active{
	animation: datetime .4s;	
}
.datetime-leave-active{
	animation: datetime .4s reverse;
}

@keyframes datetime {
	from{
		max-height: 0;
		opacity: 0.4;
	}
	to{
		max-height: 344px;
		opacity: 1;
	}
}
</style>