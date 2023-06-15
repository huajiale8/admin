import createAxios from "/@/utils/axios";

const platformUrl = "admin/order/promotion/platform/";

export function getPlatformList(params: { page: number, pageSize: number, }) {
    return createAxios({
        url: platformUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}


export function savePlatform(params: { id?: number, name: string }) {
    return createAxios({
        url: platformUrl + "save",
        method: "post",
        data: params,
    });
}

export function enablePlatform(params: { id: number }) {
    return createAxios({
        url: platformUrl + "enable",
        method: "post",
        data: params,
    });
}

export function disablePlatform(params: { id: number }) {
    return createAxios({
        url: platformUrl + "disable",
        method: "post",
        data: params,
    });
}
