
export class Navigation {
    // cal:0_row:2_col:6
    private event: Event;
    private currentElementId: string;
    private colIndex = 16;
    private rowIndex = 10;
    private currColValue: number;
    private currRowValue: number;
    private newId: string;
    constructor(event: Event) {
        this.event = event;
        this.currentElementId = (event.target as HTMLElement).id;
        this.currColValue = parseInt(this.currentElementId[this.colIndex], 10);
        this.currRowValue = parseInt(this.currentElementId[this.rowIndex], 10);
        this.newId = this.currentElementId;
    }

    public previousDay() {
        if (this.currColValue > 0) {
            this.currColValue =
                parseInt(this.currentElementId[this.colIndex], 10) - 1;
            this.newId = this.changeId(this.colIndex, this.currColValue.toString());
        } else {
            this.currColValue = 6;
            this.newId = this.changeId(this.colIndex, this.currColValue.toString());
        }
        document.getElementById(this.newId).focus();
    }

    public nextDay() {
        if (this.currColValue < 6) {
            this.currColValue =
                parseInt(this.currentElementId[this.colIndex], 10) + 1;
            this.newId = this.changeId(this.colIndex, this.currColValue.toString());
        } else {
            this.currColValue = 0;
            this.newId = this.changeId(this.colIndex, this.currColValue.toString());
        }
        document.getElementById(this.newId).focus();
    }

    public previousWeek() {
        if (this.currRowValue > 0) {
            this.currRowValue =
                parseInt(this.currentElementId[this.rowIndex], 10) - 1;
            this.newId = this.changeId(this.rowIndex, this.currRowValue.toString());
        } else {
            this.currRowValue = 4;
            this.newId = this.changeId(this.rowIndex, this.currRowValue.toString());
        }
        document.getElementById(this.newId).focus();
    }

    public nextWeek() {
        if (this.currRowValue < 4) {
            this.currRowValue =
                parseInt(this.currentElementId[this.rowIndex], 10) + 1;
            this.newId = this.changeId(this.rowIndex, this.currRowValue.toString());
        } else {
            this.currRowValue = 0;
            this.newId = this.changeId(this.rowIndex, this.currRowValue.toString());
        }
        document.getElementById(this.newId).focus();
    }

    private changeId(index: number, replacement: string) {
        return (
            this.currentElementId.substring(0, index) +
            replacement +
            this.currentElementId.substring(index + 1)
        );
    }
}