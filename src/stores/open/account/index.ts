import {defineStore} from "pinia";
import {ref} from "vue";

export const useAccountStore = defineStore("accountStore", () => {
    const account = ref();
    return {account};
});
