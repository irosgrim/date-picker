
declare global {
    interface Date {
        isToday: (date: Date | string) => boolean;
        isBeforeToday: (Date) => boolean;
    }
}
export interface Month {
    month: Date[][];
    createMonth: (month: number, year: number) => void;
    getMonth: () => Date[][];
    getWeekByIndex: (index: number) => Date[];
    getNumberOfDays: () => number;
}

Date.prototype.isBeforeToday = (date: Date) => {
    const dateToCompareWith = new Date(date);
    const today = new Date();
    return dateToCompareWith.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
}

Date.prototype.isToday = (date: Date | string) => {
    const dateToCompareWith = new Date(date);
    const today = new Date();
    return (
        dateToCompareWith.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
    );
}

class WeekOfMonth {
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
        this.week = [...this.week.filter(day => day !== dayToRemove)];
    }
    getDaysOfWeek() {
        return this.week;
    }
    emptyWeek() {
        this.week = [];
    }
}

export class MonthOfTheYear implements Month {
    public month: Date[][];
    constructor(month = 5, year = 2020, ) {
        this.createMonth(month, year);
    }
    createMonth(month = 5, year = 2020) {
        //zero based month
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const weeksOfMonth = [];
        const daysOfWeek = new WeekOfMonth();

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const thisDay = new Date(year, month, day);
            daysOfWeek.addDay(thisDay);
            if (thisDay.getDay() === 0) {
                weeksOfMonth.push([...daysOfWeek.getDaysOfWeek()]);
                daysOfWeek.emptyWeek();
            } else if (thisDay.getDate() >= lastDayOfMonth.getDate()) {
                weeksOfMonth.push([...daysOfWeek.getDaysOfWeek()]);
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
            this.month = [...weeksOfMonth];
        }
    }
    getMonth() {
        return this.month;
    }
    getWeekByIndex(index: number) {
        return this.month[index];
    }

    getNumberOfDays() {
        return this.month.reduce((accumulator, currentWeek) => accumulator += currentWeek.length, 0);
    }
}

export function getDaysOfMonth(month = 5, year = 2020, returnDate = true) {
    //zero based month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const weeksOfMonth = [];
    let daysOfWeek = [];
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const thisDay = new Date(year, month, day);
        daysOfWeek.push(returnDate ? thisDay : day);
        if (thisDay.getDay() === 0) {
            weeksOfMonth.push([...daysOfWeek]);
            daysOfWeek = [];
        } else if (thisDay.getDate() >= lastDayOfMonth.getDate()) {
            weeksOfMonth.push([...daysOfWeek]);
        }
    }
    if (weeksOfMonth[0].length < 7) {
        const emptydaysOfWeek = 7 - weeksOfMonth[0].length;
        const originalWeek = [...weeksOfMonth[0]];
        weeksOfMonth[0] = [
            ...Array.apply(null, Array(emptydaysOfWeek)).map(Number.prototype.valueOf, 0),
            ...originalWeek
        ];
    }
    if (weeksOfMonth[weeksOfMonth.length - 1].length < 7) {
        const emptydaysOfWeek = 7 - weeksOfMonth[weeksOfMonth.length - 1].length;
        const originalWeek = [...weeksOfMonth[weeksOfMonth.length - 1]];
        const filler = [...Array(emptydaysOfWeek)].map((value, index) => index + 1);
        weeksOfMonth[weeksOfMonth.length - 1] = [...originalWeek, ...filler];
        return weeksOfMonth;
    }
}

