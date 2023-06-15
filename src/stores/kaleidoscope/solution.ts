import { defineStore } from 'pinia';

export const kaleidoscopeSolutionConfig = defineStore('kaleidoscopeSolutionConfig', {
    state: () => {
        return {
            flag:false,
            name: '',
            icon: '',
            id: '',
            dialogVisible: false,
            detailVisible: false,
            operate: '新增分类配置',
            refreshPage: false,
            detailContent: [{
                link: '',
                picture: '',
            }],
            content: [
                {
                    link: '',
                    picture: '',
                }
            ]
        };
    },
    actions: {},
});
