import {defineStore} from "pinia";
import {ref} from "vue";

export const usePanoramaOrderStore = defineStore("panoramaOrderStore", () => {
    const order = ref();
    const status = ref<"add" | "edit">();
    return {order, status};
});
