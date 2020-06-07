<template>
    <div id="app">
        <div class="date-picker-container">
            <DatePicker />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DatePicker from "./components/datePicker/DatePicker.vue";

@Component({
  components: {
    DatePicker
  }
})
export default class App extends Vue {}
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
.date-picker-container {
    margin: 1rem auto;
    max-width: 880px;
}
</style>
