import { WeekOfMonth } from '../datePickerViewModel';

describe("SUT: WeekOfTheMonth", () => {

    const sut = new WeekOfMonth();
    for (let day = 1; day <= 7; day++) {
        const d = new Date(2020, 5, day);
        sut.addDay(d);
    }

    it('is defined', () => {
        expect(sut).toBeDefined();
    })

    it('it can add days to the week', () => {
        expect(sut.getAllDaysOfTheWeek().length).toEqual(7);
    })

    it('can add any day to the week', () => {
        const customWeek = new WeekOfMonth();
        customWeek.addDay(new Date(2020, 9, 5));
        const expectedResult = [new Date('2020-10-04T22:00:00.000Z')];
        expect(customWeek.getAllDaysOfTheWeek()).toEqual(expectedResult);
    })

    it('can remove any day from the week', () => {
        const customWeek = new WeekOfMonth();
        customWeek.addDay(new Date(2020, 9, 5));
        customWeek.removeDay(new Date('2020-10-04T22:00:00.000Z'));
        const expectedResult = [];
        expect(customWeek.getAllDaysOfTheWeek()).toEqual(expectedResult);
    })

    it('can remove all days in the week', () => {
        sut.removeAllDays();
        expect(sut.getAllDaysOfTheWeek()).toEqual([])
    })

})