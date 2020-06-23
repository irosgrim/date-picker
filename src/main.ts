import Vue from "vue";
import App from "./App.vue";
import {
    isBeforeToday,
    isCurrentMonth,
    isSameDay,
    getDateAsReadableText
} from "@/components/datePicker/helpers/dateFunctions";

Vue.config.productionTip = false;

Vue.prototype.$isBeforeToday = isBeforeToday;
Vue.prototype.$isCurrentMonth = isCurrentMonth;
Vue.prototype.$isSameDay = isSameDay;
Vue.prototype.$getDateAsReadableText = getDateAsReadableText;

let handleOutsideClick;
Vue.directive('clickOutside', {
    bind(el, binding, vnode) {
        handleOutsideClick = (e) => {
            e.stopPropagation();
            const { handler, exclude } = binding.value;
            let clickedOnExcludedEl = false;
            exclude.forEach(refName => {
                if (!clickedOnExcludedEl) {
                    const excludedEl = vnode.context.$refs[refName];
                    clickedOnExcludedEl = excludedEl.contains(e.target);
                }
            })

            if (!el.contains(e.target) && !clickedOnExcludedEl) {
                console.log('here')
                vnode.context[handler]();
            }
        }
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
    },

    unbind() {
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('touchstart', handleOutsideClick);
    }
})

new Vue({
    render: h => h(App)
}).$mount("#app");
