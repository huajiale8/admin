import createAxios from "/@/utils/axios";

const orderUrl = "admin/order/stats/";

type List = {
    page: number,
    pageSize: number,
    name?: string,
    distribution?: string,
    source?: string,
    province_id?: number,
    city_id?: number,
    county_id?: number,
    start_time?: string,
    end_time?: string,
}

export function orderLists(params: List) {
    return createAxios({
        url: orderUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function orderUpdate(params: any) {
    return createAxios({
        url: orderUrl + "update",
        method: "post",
        data: params,
    });
}

export function orderDelete(params: { id: number }) {
    return createAxios({
        url: orderUrl + "delete",
        method: "post",
        data: params,
    });
}

export function orderImport(params: any) {
    return createAxios({
        url: orderUrl + "import",
        method: "post",
        data: params,
    });
}

export function orderExport(params: any) {
    return createAxios({
        url: orderUrl + "export",
        method: "get",
        params,
    });
}
