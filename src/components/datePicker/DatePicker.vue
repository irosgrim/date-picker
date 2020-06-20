<template>
    <div class="date-picker">
        <div class="months-container">
            <div class="month" v-for="(month, monthIndex) in getMonths" :key="monthIndex">
                <div class="arrows">
                    <div class="arrow-container">
                        <div
                            v-if="!month.isCurrentMonth() && monthIndex === 0"
                            @click="goToPreviousMonth()"
                            class="arrow-icon"
                        >
                            <img src="././icons/arrow.svg" alt class="flip-horizontally" />
                        </div>
                    </div>
                    <h4>{{month.getMonthNameAndYear(options.monthNames)}}</h4>
                    <div>
                        <div
                            v-if="monthIndex === getMonths.length - 1"
                            @click="goToNextMonth()"
                            class="arrow-icon"
                        >
                            <img src="././icons/arrow.svg" alt />
                        </div>
                    </div>
                </div>
                <div class="week-header">
                    <ul class="week">
                        <li
                            v-for="(day, dayIndex) in options.weekDaysShort"
                            :key="dayIndex"
                        >{{ day }}</li>
                    </ul>
                </div>
                <ul class="week" v-for="(week, weekIndex) in month.weeks" :key="weekIndex">
                    <li
                        v-for="(day, dayIndex) in week"
                        :key="dayIndex"
                        :class="dayStatus(day)"
                        @click="handleSelectDay(day)"
                        role="button"
                        :aria-disabled="$isBeforeToday(day)"
                        :aria-label="handleAriaLabel(day)"
                    >
                        <div class="day" :class="handleDayStyling(day)">{{ dateToDayNumber(day) }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MonthOfTheYear, Month } from "./datePickerViewModel";
import {
  isBeforeToday,
  isCurrentMonth,
  isSameDay
} from "./helpers/dateFunctions";

export interface DatePickerOptions {
  monthNames?: string[];
  weekDaysShort?: string[];
}

@Component({})
export default class DatePicker extends Vue {
  @Prop({
    default: () => ({
      weekDaysShort: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      monthNames: [
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
      ]
    })
  })
  options!: DatePickerOptions;
  @Prop() dateOne!: Date;
  @Prop() dateTwo!: Date;
  @Prop() confirmByButton!: boolean;
  @Prop() confirmed!: boolean;
  private months: Month[] = [];
  private currMonth = new Date().getMonth(); //zero based
  private currYear = new Date().getFullYear();
  private startDate: Date | null = this.dateOne || null;
  private endDate: Date | null = this.dateTwo || null;

  @Watch("startDate")
  private startDateSelected(newValue: Date) {
    if (!this.confirmByButton) {
      this.$emit("startDateSelected", newValue);
    }
  }

  @Watch("endDate")
  private endDateSelected(newValue: Date) {
    if (!this.confirmByButton) {
      this.$emit("endDateSelected", newValue);
    }
  }

  @Watch("confirmed")
  private dateWasConfirmed(val: boolean) {
    if (val === true && this.confirmByButton === true) {
      this.$emit("startDateSelected", this.startDate);
      this.$emit("endDateSelected", this.endDate);
      this.$emit("closeDatePicker");
    }
  }

  private created() {
    let month = this.currMonth;
    let year = this.currYear;

    if (this.startDateSelected) {
      const d = new Date(this.startDate);
      month = d.getMonth();
      year = d.getFullYear();
    }
    this.months = [
      new MonthOfTheYear(month, year),
      new MonthOfTheYear(month + 1, year)
    ];
  }

  private goToNextMonth() {
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

  private goToPreviousMonth() {
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

  private isCurrentMonth(date: string) {
    return isCurrentMonth(date);
  }

  private dayStatus(day: Date) {
    if (typeof day !== "number") {
      if (this.startDate !== null && isSameDay(day, this.startDate)) {
        return ["start-day"];
      }

      if (this.endDate !== null && isSameDay(day, this.endDate)) {
        return ["end-day"];
      }
    }
  }
  private handleSelectDay(day: Date) {
    if (
      this.startDate === null &&
      this.endDate === null &&
      !isBeforeToday(day)
    ) {
      this.startDate = day;
    } else if (
      this.startDate !== null &&
      this.endDate === null &&
      !isBeforeToday(day)
    ) {
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

    if (
      isSameDay(day, this.startDate) &&
      this.endDate &&
      !isSameDay(this.endDate, this.startDate)
    ) {
      return ["radius-left"];
    }

    if (isSameDay(day, this.endDate)) {
      return ["radius-right"];
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

  handleAriaLabel(day: Date): string {
    const utcStartDate = Date.parse(this.startDate.toDateString());
    const utcEndDate = Date.parse(this.endDate.toDateString());
    const utcCurrentDate =
      typeof day !== "number" && Date.parse(day.toDateString());
    if (
      typeof day !== "number" &&
      utcStartDate !== utcCurrentDate &&
      utcEndDate !== utcCurrentDate
    ) {
      return "Choose " + this.$getDateAsReadableText(day);
    }
    if (
      typeof day !== "number" &&
      utcStartDate === utcCurrentDate &&
      utcEndDate === utcCurrentDate
    ) {
      return (
        "You chose " +
        this.$getDateAsReadableText(day) +
        " as a start and end date"
      );
    }
    if (
      typeof day !== "number" &&
      utcStartDate === utcCurrentDate &&
      utcEndDate !== utcCurrentDate
    ) {
      return "You chose " + this.$getDateAsReadableText(day) + " as start date";
    }
    if (
      typeof day !== "number" &&
      utcStartDate !== utcCurrentDate &&
      utcEndDate === utcCurrentDate
    ) {
      return "You chose " + this.$getDateAsReadableText(day) + " as end date";
    }
  }
}
</script>

<style lang="scss">
    @import "./date-picker.scss";
</style>
