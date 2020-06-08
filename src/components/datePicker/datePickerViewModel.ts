
export interface Month {
    weeks: Date[][];
    createMonth: (month: number, year: number) => void;
    getWeeksOfTheMonth: () => Date[][];
    getWeekByIndex: (index: number) => Date[];
    getNumberOfDays: () => number;
    getDay: (dayIndex: number) => Date | string;
}

export class WeekOfMonth {
    constructor(public week: Date[] = []) {
        this.week = week;
    }
    setWeek(week: Date[]) {
        this.week = week;
    }
    addDay(day: Date) {
        this.week = [...this.week, day];
    }
    removeDay(dayToRemove: Date) {
        this.week = [...this.week.filter(day => day.getDate() !== dayToRemove.getDate())];
    }
    getAllDaysOfTheWeek() {
        return this.week;
    }
    removeAllDays() {
        this.week = [];
    }
}

export class MonthOfTheYear implements Month {
    public weeks: Date[][];
    constructor(month, year) {
        this.createMonth(month, year);
    }
    createMonth(month: number, year: number) {
        //zero based month
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const weeksOfMonth = [];
        const daysOfWeek = new WeekOfMonth();
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const thisDay = new Date(year, month, day);
            daysOfWeek.addDay(thisDay);
            if (thisDay.getDay() === 0) {
                weeksOfMonth.push([...daysOfWeek.getAllDaysOfTheWeek()]);
                daysOfWeek.removeAllDays();
            } else if (thisDay.getDate() >= lastDayOfMonth.getDate()) {
                weeksOfMonth.push([...daysOfWeek.getAllDaysOfTheWeek()]);
            }
        }
        if (weeksOfMonth[0].length < 7) {
            const emptyDays = 7 - weeksOfMonth[0].length;
            const originalWeek = [...weeksOfMonth[0]];
            weeksOfMonth[0] = [
                ...Array.apply(null, Array(emptyDays)).map(Number.prototype.valueOf, 0),
                ...originalWeek
            ];
        }
        if (weeksOfMonth[weeksOfMonth.length - 1].length < 7) {
            const emptyDays = 7 - weeksOfMonth[weeksOfMonth.length - 1].length;
            const originalWeek = [...weeksOfMonth[weeksOfMonth.length - 1]];
            const filler = [...Array(emptyDays)].map((value, index) => index + 1);
            weeksOfMonth[weeksOfMonth.length - 1] = [...originalWeek, ...filler];
        }
        this.weeks = [...weeksOfMonth];
    }
    getWeeksOfTheMonth() {
        return this.weeks;
    }
    getWeekByIndex(index: number) {
        return this.weeks[index];
    }

    getNumberOfDays() {
        const monthWithoutEmptyDays = this.weeks.map(week => week.filter(day => typeof day !== 'number'));
        return monthWithoutEmptyDays.reduce((accumulator, currentWeek) => accumulator += currentWeek.length, 0);
    }

    getDay(dayIndex: number) {
        const weeksCopy = [...this.weeks].flat();
        return weeksCopy[dayIndex];
    }
}

