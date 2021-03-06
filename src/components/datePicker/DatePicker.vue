<template>
    <div class="date-picker">
        <div class="months-container">
            <div class="month" v-for="(month, monthIndex) in getMonths" :key="monthIndex">
                <div class="arrows">
                    <div class="arrow-container">
                        <button
                            type="button"
                            v-show="!month.isCurrentMonth() && monthIndex === 0"
                            @click="goToPreviousMonth()"
                            class="btn arrow"
                        >
                            <img src="././icons/chevron.svg" alt class="flip-horizontally" />
                        </button>
                    </div>
                    <h4>{{month.getMonthNameAndYear(options.monthNames)}}</h4>
                    <div>
                        <button
                            type="button"
                            v-if="monthIndex === getMonths.length - 1"
                            @click="goToNextMonth()"
                            class="btn arrow"
                            v-focus
                        >
                            <img src="././icons/chevron.svg" alt />
                        </button>
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
                    <li v-for="(day, dayIndex) in week" :key="dayIndex" :class="dayStatus(day)">
                        <button
                            class="day"
                            :class="handleDayStyling(day)"
                            :aria-disabled="$isBeforeToday(day)"
                            :aria-label="$getDateAsReadableText(day)"
                            :id="`cal:${monthIndex}_row:${weekIndex}_col:${dayIndex}`"
                            @click="handleSelectDay(day, $event)"
                            :disabled="$isBeforeToday(day) || isDisabledDay(day) || isDisabledDayOfWeek(day)"
                            :tabindex="day.toString() === dateTwo.toString() ? '0' : '-1'"
                        >{{ dateToDayNumber(day) }}</button>
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
  isSameDay,
  getDate,
  getDayOfWeek
} from "./helpers/dateFunctions";
import { Navigation } from "./helpers/calendarKeyboardNavigation";

export interface DatePickerOptions {
  monthNames?: string[];
  weekDaysShort?: string[];
}

declare global {
  interface String {
    replaceAt(index: number, replacement: string): string;
  }
}

String.prototype.replaceAt = function(index: number, replacement: string) {
  return this.substring(0, index) + replacement + this.substring(index + 1);
};

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
  @Prop() disabledDays!: string[];
  @Prop() disabledDaysOfWeek!: string[];
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
      this.currMonth = d.getMonth();
      this.currYear = d.getFullYear();
      month = d.getMonth();
      year = d.getFullYear();
    }
    this.months = [
      new MonthOfTheYear(month, year),
      new MonthOfTheYear(month + 1, year)
    ];
  }

  private mounted() {
    document.addEventListener("keydown", this.navigate);
  }

  private beforeDestroy() {
    document.removeEventListener("keydown", this.navigate);
  }

  private navigate(e: KeyboardEvent) {
    const id = (e.target as HTMLButtonElement).id;
    const goTo = new Navigation(e);
    switch (e.key) {
      case "ArrowLeft":
        if (id) {
          goTo.previousDay();
        }
        break;

      case "ArrowUp":
        if (id) {
          goTo.previousWeek();
        }
        break;

      case "ArrowRight":
        if (id) {
          goTo.nextDay();
        }
        break;

      case "ArrowDown":
        if (id) {
          goTo.nextWeek();
        }
        break;
      case "Escape":
        this.$emit("closeDatePicker");
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  private goToNextMonth() {
    if (this.currMonth < 11) {
      this.currMonth += 1;
    } else {
      this.currMonth = 0;
      this.currYear += 1;
    }
    this.months = [
      new MonthOfTheYear(this.currMonth, this.currYear),
      new MonthOfTheYear(this.currMonth + 1, this.currYear)
    ];
  }

  private goToPreviousMonth() {
    if (this.currMonth > 0) {
      this.currMonth -= 1;
    } else {
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

  private handleSelectDay(day: Date, event: Event) {
    (event.target as HTMLButtonElement).setAttribute("tabindex", "0");
    if (!isBeforeToday(day)) {
      if (this.startDate === null && this.endDate === null) {
        this.startDate = day;
      } else if (this.startDate !== null && this.endDate === null) {
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
      const utcStartDate = Date.parse(this.startDate.toDateString());
      const utcEndDate = Date.parse(this.endDate.toDateString());
      const utcCurrentDate = Date.parse(new Date(day).toDateString());

      if (
        utcCurrentDate > utcStartDate &&
        utcCurrentDate < utcEndDate &&
        !this.isDisabledDay(day) &&
        !this.isDisabledDayOfWeek(day)
      ) {
        return ["date-interval"];
      }
    }
  }

  isDisabledDay(day: Date): boolean {
    if (this.disabledDays) {
      return this.disabledDays.includes(getDate(day));
    }
    return false;
  }

  isDisabledDayOfWeek(day: Date): boolean {
    if (this.disabledDaysOfWeek) {
      return this.disabledDaysOfWeek.includes(getDayOfWeek(day));
    }
    return false;
  }
}
</script>

<style lang="scss">
    @import "./date-picker.scss";
</style>
