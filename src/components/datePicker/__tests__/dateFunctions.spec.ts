import { isBeforeToday, isCurrentMonth, isToday } from "../helpers/dateFunctions";

describe("SUT: dateFunctions", () => {
    it("returns true if the date is before today", () => {
        const dateToTest = new Date('1983-06-07T20:52:49.038Z');
        expect(isBeforeToday(dateToTest)).toBeTruthy()
    })

    it("returns false if the date is not before today", () => {
        const dateToTest = new Date('2030-06-10T20:52:49.038Z');
        expect(isBeforeToday(dateToTest)).toBeFalsy()
    })

    it("returns false if the date is not this month", () => {
        const dateToTest = new Date('2020-05-10T20:52:49.038Z');
        expect(isCurrentMonth(dateToTest)).toBeFalsy()
    })

    it("returns true if the date is this month", () => {
        const dateToTest = new Date();
        expect(isCurrentMonth(dateToTest)).toBeTruthy()
    })

    it("returns true if the date is  today", () => {
        const dateToTest = new Date();
        expect(isToday(dateToTest)).toBeTruthy()
    })

    it("returns false if the date is not today", () => {
        const dateToTest = new Date('1983-10-04T20:52:49.038Z');
        expect(isToday(dateToTest)).toBeFalsy()
    })

})