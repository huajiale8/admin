import {defineStore} from "pinia";
import {ref} from "vue";

export const usePanoramaTaskStore = defineStore("panoramaTaskStore", () => {
    // const order = ref();
    const task = ref<{ [key: string]: string | number | null | undefined }>({});
    const organs = ref<{ oid: number, org_name: string }[]>([]);
    const info = ref<{ name: string, desc: string }>();
    const members = ref<{ mid: number, nickname: string, phone: string }[]>([]);
    const pictures = ref([]);
    const fileList = ref<string[]>([]);
    // const status = ref<"add" | "edit">();

    return {organs, info, task, members, pictures, fileList};
});
