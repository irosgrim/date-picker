<template>
    <div class="date-picker">
        <div class="arrows">
            <div>
                <div v-if="!isThisMonth(getMonths[0].getDay(15))" @click="previousMonth()">
                    <img src="././icons/left-arrow.svg" alt />
                </div>
            </div>
            <div>
                <div @click="nextMonth()">
                    <img src="././icons/right-arrow.svg" alt />
                </div>
            </div>
        </div>
        <div class="months-container">
            <div class="month" v-for="(month, monthIndex) in getMonths" :key="monthIndex">
                <h4>{{getMonthName(month.weeks[2][4])}}</h4>
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
                        <div
                            class="day"
                            :class="isBetweenSelectedDates(day)"
                        >{{ dateToDayNumber(day) }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  MonthOfTheYear,
  Month
} from "@/components/datePicker/datePickerViewModel.ts";

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
  private startDay: Date | null = null;
  private endDay: Date | null = null;

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
    if (
      this.currYear >= now.getFullYear() &&
      this.currMonth > now.getMonth() &&
      this.currMonth > 0
    ) {
      this.currMonth -= 1;
    } else {
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

  private today(date: Date) {
    const d = new Date();
    return d.isToday(date);
  }

  private beforeToday(date: Date) {
    const d = new Date();
    return d.isBeforeToday(date);
  }

  private get getMonths() {
    return this.months;
  }

  private getMonthName(date: string) {
    const d = new Date(Date.parse(date));
    return this.monthNames[d.getMonth()] + " " + d.getFullYear();
  }

  private isThisMonth(date: string) {
    const dateToCompare = new Date(Date.parse(date));
    const now = new Date();
    if (
      now.getFullYear() === dateToCompare.getFullYear() &&
      now.getMonth() === dateToCompare.getMonth()
    ) {
      return true;
    }
    return false;
  }

  private dayStatus(day: Date) {
    if (typeof day !== "number") {
      if (this.startDay !== null && day === this.startDay) {
        return ["start-day"];
      }
      if (this.endDay !== null && day.toString() === this.endDay.toString()) {
        return ["end-day"];
      }
    }
  }
  private handleSelectDay(day: Date) {
    if (this.startDay === null && this.endDay === null) {
      this.startDay = day;
    } else if (this.startDay !== null && this.endDay === null) {
      const utcStartDate = Date.parse(this.startDay.toDateString());
      const utcCurrentDate = Date.parse(day.toDateString());
      console.log(utcStartDate, utcCurrentDate);
      if (utcCurrentDate < utcStartDate) {
        this.endDay = this.startDay;
        this.startDay = day;
      } else {
        this.endDay = day;
      }
    } else if (this.startDay !== null && this.endDay !== null) {
      this.startDay = day;
      this.endDay = null;
    }
  }

  private isBetweenSelectedDates(day: Date | string) {
    if (this.startDay && this.endDay) {
      const startDate = new Date(this.startDay);
      const endDate = new Date(this.endDay);
      const currentDate = new Date(day);
      if (
        currentDate.getDate() > startDate.getDate() &&
        currentDate.getDate() < endDate.getDate() &&
        currentDate.getMonth() <= endDate.getMonth()
      ) {
        return ["date-interval"];
      }
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
.date-picker {
    border: 1px solid #ababab;
}
.months-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
}
.month {
    width: 100%;
    max-width: 400px;
    height: 100%;
    min-height: 326px;
    padding: 0.5rem;
}
.week {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    list-style-type: none;
    width: 100%;
    padding: 0;
    margin: 0;
    li {
        width: 100%;
        height: 100%;
    }
}
.today {
    background-color: pink;
}
.arrows {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 38px;
}
.start-day {
    background-color: #c4f0f3;
    border-left: 2px solid #35b4bd;
}
.end-day {
    background-color: #c4f0f3;
    border-right: 2px solid #35b4bd;
}
.disabled {
    color: #d3d3d3;
}
.day {
    padding: 0.4rem;
    width: 100%;
    height: 100%;
}
.date-interval {
    font-weight: bold;
    background-color: #c4f0f3;
    width: 100%;
    height: 100%;
}
a {
    color: #42b983;
}
</style>
