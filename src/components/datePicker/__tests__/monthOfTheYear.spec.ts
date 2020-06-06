import { MonthOfTheYear } from '../datePickerViewModel';

describe("Start tests: MonthOfTheYear", () => {
    const sut = new MonthOfTheYear(5, 2020);
    it("is defined", () => {

        expect(sut).toBeDefined();
    })

    it('creates a month array', () => {
        expect(sut.weeks).toBeTruthy();
    })

    it('returns number of days in the given month', () => {
        const february2021 = new MonthOfTheYear(1, 2021);
        expect(february2021.getNumberOfDays()).toEqual(28);
    })

    it('returns the week at specific index', () => {
        const weekAtIndex = sut.weeks[3];
        expect(sut.getWeekByIndex(3)).toEqual(weekAtIndex);
    })

    it('contains valid date strings', () => {
        const randomDay = new Date(sut.weeks[2][3]);
        expect(typeof randomDay.getDate()).toEqual('number');
    })

    it('returns the right days of the week', () => {
        const june2020 = new MonthOfTheYear(5, 2020);
        const firstWeek = june2020.getWeekByIndex(0).map(day => day.getDate());
        const testResult = [1, 2, 3, 4, 5, 6, 7];
        expect(firstWeek).toEqual(testResult);
    })

})