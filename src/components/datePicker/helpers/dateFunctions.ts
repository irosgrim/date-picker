
export const isBeforeToday = (date: Date): boolean => {
    const dateToCompareWith = new Date(date);
    const today = new Date();
    return dateToCompareWith.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
}

export const isToday = (date: Date | string): boolean => {
    const dateToCompareWith = new Date(date);
    const today = new Date();
    return (
        dateToCompareWith.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
    );
}

export const isSameDay = (date: Date | string, dateToCompare: Date | string): boolean => {
    const dateToCompareWith = new Date(dateToCompare);
    const dateToBeCompared = new Date(date);
    return dateToCompareWith.setHours(0, 0, 0, 0) === dateToBeCompared.setHours(0, 0, 0, 0);
}

export const isCurrentMonth = (date: Date | string): boolean => {
    const dateToCompare = new Date(date);
    const thisMonth = new Date();
    return dateToCompare.getMonth() === thisMonth.getMonth() && dateToCompare.getFullYear() === thisMonth.getFullYear();
}

export const formatDateToString = (date: Date, monthArr: string[]): string => {
    if (date) {
        const d = new Date(date);
        return d.getDate() + ' ' + monthArr[d.getMonth()] + ' ' + d.getFullYear();
    } else {
        return null;
    }
}

export const addDays = (date: Date, numberOfDays: number): Date => {
    const d = Date.parse(date.toDateString());
    const millisecondsInOneDay = 86400000;
    const utcDate = d + (millisecondsInOneDay * numberOfDays);
    return new Date(utcDate);
}

export const getDateAsReadableText = (date: Date): string => {
    if (typeof date !== 'number') {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(date).toLocaleDateString(undefined, options)
    }
    return '';
}

export const getDate = (date: Date): string => {
    if(date) {
        const d = new Date(date);
        const correctMonth = d.getMonth() + 1;
        const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
        const month = correctMonth < 10 ? '0' + correctMonth : correctMonth;
        return d.getFullYear() + '-' + month + '-' + day;
    }
    return '';
}

export const getDayOfWeek = (date: Date): string => {
    const weekDaysShort = [
        "Su",
        "Mo", 
        "Tu", 
        "We", 
        "Th", 
        "Fr", 
        "Sa", 
      ];
    if(date) {
        const d = new Date(date);
        return weekDaysShort[d.getDay()];
    }

}