<template>
    <div id="app">
       <div class="date-button" @click="() => showDatePicker = !showDatePicker">
            <div>
                {{formatDate(startDate)}} 
            </div>
            <div v-if="endDate">&rightarrow;</div>
            <div> 
                    <div v-if="endDate">
                    {{formatDate(endDate)}}
                    </div>
            </div>
       </div>
        <div class="date-picker-container" v-if="showDatePicker">
            <DatePicker 
                :options="datePickerOptions"
                :dateOne="startDate"
                :dateTwo="endDate"
                @startDateSelected = "(startDateValue) => startDate = startDateValue"
                @endDateSelected = " (endDateValue) => endDate = endDateValue"
                />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DatePicker from "./components/datePicker/DatePicker.vue";
import { formatDateToString, addDays } from './components/datePicker/helpers/dateFunctions'

@Component({
  components: {
    DatePicker,
  }
})
export default class App extends Vue {
    private datePickerOptions = {
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
        ],
        monthNamesShort: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],
        weekDaysShort: [
            "Mo", 
            "Tu", 
            "We", 
            "Th", 
            "Fr", 
            "Sa", 
            "Su"
        ],
    }

    private showDatePicker = true;
    private startDate: Date | null = new Date();
    private endDate: Date | null = addDays(new Date(), 4);

    private formatDate(date: Date) {
        return formatDateToString(date, this.datePickerOptions.monthNamesShort);
    }

}


</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.date-button {
    max-width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    border: 1px solid #ababab;
    padding: 0.8rem;
    border-radius: 4px;
    margin: 0 auto;
    cursor: pointer;
}
.date-picker-container {
    margin: 1rem auto;
    box-shadow: 4px 4px 12px 4px rgba(95, 101, 114, 0.25);
    border-radius: 4px;
    max-width: 600px;
}
</style>
