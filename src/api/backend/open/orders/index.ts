import createAxios from "/@/utils/axios";

const openOrdersUrl = "admin/open/plane/orders/";

export function getOpenOrdersUrlList(params: { page: number, pageSize: number, }) {
    return createAxios({
        url: openOrdersUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getOpenOrdersUrlDetail(params: { id: number }) {
    return createAxios({
        url: openOrdersUrl + "detail",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function saveOpenOrdersUrl(params: {
    id?: number,
    name: string,
    expire_time: string,
    type: number,
    desc: string
}) {
    return createAxios({
        url: openOrdersUrl + "save",
        method: "post",
        data: params,
    });
}

export function enableOpenOrdersUrl(params: { id: number }) {
    return createAxios({
        url: openOrdersUrl + "enable",
        method: "post",
        data: params,
    });
}

export function disableOpenOrdersUrl(params: { id: number }) {
    return createAxios({
        url: openOrdersUrl + "disable",
        method: "post",
        data: params,
    });
}
