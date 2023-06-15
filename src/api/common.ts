import createAxios from "/@/utils/axios";
const commonURl = 'common/categories'
// api模块(前台)
export function websiteInfo() {
    return createAxios({
        url: "/common/websiteInfo",
        method: "GET",
        params: {},
        data: {noSuccessMessage: true}
    });
}
export function classificationLists() {
    return createAxios({
        url: commonURl ,
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

