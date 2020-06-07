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
      if (this.startDate !== null && day === this.startDate) {
        return ["start-day"];
      }
      if (this.endDate !== null && day.toString() === this.endDate.toString()) {
        return ["end-day"];
      }
    }
  }
  private handleSelectDay(day: Date) {
    if (this.startDate === null && this.endDate === null) {
      this.startDate = day;
    } else if (this.startDate !== null && this.endDate === null) {
      const utcStartDate = Date.parse(this.startDate.toDateString());
      const utcCurrentDate = Date.parse(day.toDateString());
      if (utcCurrentDate < utcStartDate) {
        this.endDate = this.startDate;
        this.startDate = day;
      } else {
        this.endDate = day;
      }
    } else if (this.startDate !== null && this.endDate !== null) {
      this.startDate = day;
      this.endDate = null;
    }
  }

  private isBetweenSelectedDates(day: Date) {
    if (this.startDate && this.endDate) {
      const utcStartDate = Date.parse(this.startDate.toDateString());
      const utcEndDate = Date.parse(this.endDate.toDateString());
      const utcCurrentDate = Date.parse(new Date(day).toDateString());
      if (utcCurrentDate > utcStartDate && utcCurrentDate < utcEndDate) {
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
    font-weight: bold;
}
.end-day {
    background-color: #c4f0f3;
    border-right: 2px solid #35b4bd;
    font-weight: bold;
}
.disabled {
    color: #d3d3d3;
}
.day {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.4rem;
    width: 100%;
    height: 100%;
}
.date-interval {
    background-color: #c4f0f3;
    width: 100%;
    height: 100%;
}
a {
    color: #42b983;
}
</style>
