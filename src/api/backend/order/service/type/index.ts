import createAxios from "/@/utils/axios";

const serviceTypeUrl = "admin/order/service/type/";

export function getServiceTypeList(params: { page: number, pageSize: number, }) {
    return createAxios({
        url: serviceTypeUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function saveServiceType(params: { id?: number, name: string }) {
    return createAxios({
        url: serviceTypeUrl + "save",
        method: "post",
        data: params,
    });
}

export function enableServiceType(params: { id: number }) {
    return createAxios({
        url: serviceTypeUrl + "enable",
        method: "post",
        data: params,
    });
}

export function disableServiceType(params: { id: number }) {
    return createAxios({
        url: serviceTypeUrl + "disable",
        method: "post",
        data: params,
    });
}
