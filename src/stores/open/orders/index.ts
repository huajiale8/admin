import {defineStore} from "pinia";
import {ref} from "vue";

export const useOpenOrderStore = defineStore("openOrderStore", () => {
    const order = ref();
    const status = ref<"add" | "edit">();

    return {order, status};
});
