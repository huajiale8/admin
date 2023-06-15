import {defineStore} from "pinia";
import {ref} from "vue";

export const useOutsourceStore = defineStore("outsourceStore", () => {
    const order = ref();
    const status = ref<"add" | "edit">();

    return {order, status};
});
