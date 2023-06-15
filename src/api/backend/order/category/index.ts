import createAxios from "/@/utils/axios";

const categoryUrl = "admin/order/category/";

export function getCategoryList(params: { page: number, pageSize: number, }) {
    return createAxios({
        url: categoryUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function saveCategory(params: { id?: number, name: string }) {
    return createAxios({
        url: categoryUrl + "save",
        method: "post",
        data: params,
    });
}

export function enableCategory(params: { id: number }) {
    return createAxios({
        url: categoryUrl + "enable",
        method: "post",
        data: params,
    });
}

export function disableCategory(params: { id: number }) {
    return createAxios({
        url: categoryUrl + "disable",
        method: "post",
        data: params,
    });
}
