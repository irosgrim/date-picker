import Vue from 'vue'

declare module 'vue/types/vue' {
    interface Vue {
        $isBeforeToday: (d: Date) => boolean;
        $isCurrentMonth: (d: Date) => boolean;
        $isSameDay: (d: Date) => boolean;
        $getDateAsReadableText: (d: Date) => string;
    }
}