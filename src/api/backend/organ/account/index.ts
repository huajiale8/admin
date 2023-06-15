import createAxios from "/@/utils/axios";

const url = "admin/organ/account/";

export function getAccountList(params: {
    page: number,
    pageSize: number,
    email?: string,
    status?: number,
    enterprise_name?: string
    total?: number,
    province_id?: number,
    city_id?: number,
    county_id?: number,
}) {
    return createAxios({
        url: url + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getAccountDetail(params: { id: number }) {
    return createAxios({
        url: url + "detail",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function enableAccount(params: { id: number }) {
    return createAxios({
        url: url + "enable",
        method: "post",
        data: params,
    });
}

export function disableAccount(params: { id: number }) {
    return createAxios({
        url: url + "forbidden",
        method: "post",
        data: params,
    });
}

export function rejectAccount(params: { id: number, audit_failed_reason: string }) {
    return createAxios({
        url: url + "reject",
        method: "post",
        data: params,
    });
}

export function passAccount(params: { id: number, }) {
    return createAxios({
        url: url + "pass",
        method: "post",
        data: params,
    });
}

export function addAccountCapital(params: { id: number, amount: number, desc: string }) {
    return createAxios({
        url: url + "capital",
        method: "post",
        data: params,
    });
}

export function setAccountType(params: { id: number, level: number, discount: number }) {
    return createAxios({
        url: url + "type",
        method: "post",
        data: params,
    });
}
