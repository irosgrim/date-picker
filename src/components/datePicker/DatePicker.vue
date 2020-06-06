<template>
    <div class="calendar-container">
        <div class="week-header">
            <div class="arrows" @click="nextMonth()">
                <div>◀️</div>
                <div>▶️</div>
            </div>
            <ul class="week">
                <li v-for="(day, dayIndex) in week" :key="dayIndex">{{ day }}</li>
            </ul>
        </div>
        <ul class="week" v-for="(week, weekIndex) in currentMonth.month" :key="weekIndex">
            <li
                v-for="(day, dayIndex) in week"
                :key="dayIndex"
                :class="today(day) ? 'today' : beforeToday(day) ? 'disabled' : null"
            >{{ dateToDayNumber(day) }}</li>
        </ul>
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
  private currentMonth = {};
  private week: string[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Sa"];
  private currMonth = 5; //zero based
  private i = 0;
  private years = 0;

  private created() {
    this.currentMonth = new MonthOfTheYear(this.currMonth, 2020);
  }

  private nextMonth() {
    if (this.currMonth + this.i < 11) {
      this.i += 1;
    } else {
      this.years += 1;
      this.currMonth = 0;
      this.i = 0;
    }
    (this.currentMonth as Month).createMonth(
      this.currMonth + this.i,
      2020 + this.years
    );
  }

  private dateToDayNumber(date: Date | number) {
    const isDate = typeof (date as Date).getMonth === "function";
    const currDate = isDate ? new Date(date) : date;
    return isDate ? (currDate as Date).getDate() : currDate;
  }

  private today(date: Date) {
    const d = new Date();
    return d.isToday(date);
  }
  private beforeToday(date: Date) {
    const d = new Date();
    return d.isBeforeToday(date);
  }
}
</script>

<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
.calendar-container {
    max-width: 600px;
    border: 1px solid #ababab;
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
        padding: 0.4rem;
        border: 1px solid #ababab;
    }
}
.today {
    background-color: pink;
}
.arrows {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.disabled {
    color: #d3d3d3;
}
a {
    color: #42b983;
}
</style>
