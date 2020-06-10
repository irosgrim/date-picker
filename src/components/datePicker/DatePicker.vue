<template>
    <div class="date-picker">
        <div class="months-container">
            <div class="month" v-for="(month, monthIndex) in getMonths" :key="monthIndex">
                <div class="arrows">
                    <div class="arrow-container">
                        <div v-if="!isCurrentMonth(getMonths[0].getDay(15)) && monthIndex === 0" @click="previousMonth()" class="arrow-icon">
                            <img src="././icons/arrow.svg" alt class="flip-horizontally"/>
                        </div>
                    </div>
                    <h4>{{getMonthName(month.weeks[2][4])}}</h4>
                    <div>
                        <div v-if="monthIndex === getMonths.length - 1" @click="nextMonth()" class="arrow-icon">
                            <img src="././icons/arrow.svg" alt/>
                        </div>
                    </div>
                </div>
               <div class="week-header">
                    <ul class="week">
                        <li v-for="(day, dayIndex) in week" :key="dayIndex">{{ day }}</li>
                    </ul>
               </div>
                <ul class="week" v-for="(week, weekIndex) in month.weeks" :key="weekIndex">
                    <li
                        v-for="(day, dayIndex) in week"
                        :key="dayIndex"
                        :class="dayStatus(day)"
                        @click="handleSelectDay(day)"
                    >
                        <div class="day" :class="handleDayStyling(day)">{{ dateToDayNumber(day) }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MonthOfTheYear, Month } from "./datePickerViewModel";
import {
  isBeforeToday,
  isToday,
  isCurrentMonth,
  isSameDay
} from "./helpers/dateFunctions";

@Component({})
export default class DatePicker extends Vue {
  @Prop() private msg!: string;
  private months: Month[] = [];
  private week: string[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Sa"];
  private monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  private currMonth = new Date().getMonth(); //zero based
  private currYear = new Date().getFullYear();
  private startDate: Date | null = null;
  private endDate: Date | null = null;

  private created() {
    this.months = [
      new MonthOfTheYear(this.currMonth, this.currYear),
      new MonthOfTheYear(this.currMonth + 1, this.currYear)
    ];
  }

  private nextMonth() {
    if (this.currMonth < 11) {
      this.currMonth += 1;
    } else {
      this.currYear += 1;
      this.currMonth = 0;
    }
    this.months = [
      new MonthOfTheYear(this.currMonth, this.currYear),
      new MonthOfTheYear(this.currMonth + 1, this.currYear)
    ];
  }

  private previousMonth() {
    const now = new Date();
    if (this.currYear >= now.getFullYear()) {
      this.currMonth -= 1;
    } else if (this.currMonth < 0) {
      this.currMonth = 11;
      this.currYear -= 1;
    }
    this.months = [
      new MonthOfTheYear(this.currMonth, this.currYear),
      new MonthOfTheYear(this.currMonth + 1, this.currYear)
    ];
  }

  private dateToDayNumber(date: Date | number) {
    const isDate = typeof (date as Date).getMonth === "function";
    const currDate = isDate ? new Date(date) : date;
    return isDate ? (currDate as Date).getDate() : " ";
  }

  private get getMonths() {
    return this.months;
  }

  private getMonthName(date: string) {
    const d = new Date(Date.parse(date));
    return this.monthNames[d.getMonth()] + " " + d.getFullYear();
  }

  private isCurrentMonth(date: string) {
    return isCurrentMonth(date);
  }

  private dayStatus(day: Date) {
    if (typeof day !== "number") {
      if (this.startDate !== null && isSameDay(day,this.startDate)) {
        return ["start-day"];
      }

      if (this.endDate !== null && isSameDay(day, this.endDate)) {
        return ["end-day"];
      }

    }
  }
  private handleSelectDay(day: Date) {
    if (this.startDate === null && this.endDate === null  && !isBeforeToday(day)) {
      this.startDate = day;

    } else if (this.startDate !== null && this.endDate === null  && !isBeforeToday(day)) {
      const utcStartDate = Date.parse(this.startDate.toDateString());
      const utcCurrentDate = Date.parse(day.toDateString());

      if (utcCurrentDate < utcStartDate) {
        this.endDate = this.startDate;
        this.startDate = day;

      } else if (utcCurrentDate > utcStartDate) {
        this.endDate = day;

      } else {
        return;
      }

    } else if (this.startDate !== null && this.endDate !== null) {
      this.startDate = day;
      this.endDate = null;
    }

  }

  private handleDayStyling(day: Date) {
    if (isBeforeToday(day)) {
      return ["before-today"];
    }

    if(isSameDay(day, this.startDate) && this.endDate && !isSameDay(this.endDate, this.startDate)) {
      return ["radius-left"];
    }

    if(isSameDay(day, this.endDate)) {

      return ["radius-right"]
    }

    if (this.startDate && this.endDate) {
      const dateIntervalCssClasses = ["date-interval"];
      const utcStartDate = Date.parse(this.startDate.toDateString());
      const utcEndDate = Date.parse(this.endDate.toDateString());
      const utcCurrentDate = Date.parse(new Date(day).toDateString());

      if (utcCurrentDate > utcStartDate && utcCurrentDate < utcEndDate) {
        return dateIntervalCssClasses;
      }

    }
  }
}
</script>

<style lang="scss">
@import "./date-picker.scss";
</style>
