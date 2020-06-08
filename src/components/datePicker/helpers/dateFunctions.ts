
export const isBeforeToday = (date: Date) => {
    const dateToCompareWith = new Date(date);
    const today = new Date();
    return dateToCompareWith.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
}

export const isToday = (date: Date | string) => {
    const dateToCompareWith = new Date(date);
    const today = new Date();
    return (
        dateToCompareWith.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
    );
}

export const isCurrentMonth = (date: Date | string) => {
    const dateToCompare = new Date(date);
    const thisMonth = new Date();
    return dateToCompare.getMonth() === thisMonth.getMonth() && dateToCompare.getFullYear() === thisMonth.getFullYear();
}

export const convertDaysToMiliseconds = (d: number) => {
    return d * 86400000;
}

export const isSameMonth = (day: Date, dateToCompareWith: Date) => {
    const d = new Date(day);
    const dateToBeCompared = new Date(dateToCompareWith);
    return d.getMonth() === dateToBeCompared.getMonth();
}