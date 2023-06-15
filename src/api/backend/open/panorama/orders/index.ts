import createAxios from "/@/utils/axios";

const panoramaOrdersUrl = "admin/open/panorama/orders/";

export function getPanoramaOrdersUrlList(params: { page: number, pageSize: number, }) {
    return createAxios({
        url: panoramaOrdersUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getPanoramaOrdersUrlDetail(params: { id: number }) {
    return createAxios({
        url: panoramaOrdersUrl + "detail",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function savePanoramaOrdersUrl(params: {
    id?: number,
    name: string,
    expire_time: string,
    type: number,
    desc: string
}) {
    return createAxios({
        url: panoramaOrdersUrl + "save",
        method: "post",
        data: params,
    });
}

export function enablePanoramaOrdersUrl(params: { id: number }) {
    return createAxios({
        url: panoramaOrdersUrl + "enable",
        method: "post",
        data: params,
    });
}

export function disablePanoramaOrdersUrl(params: { id: number }) {
    return createAxios({
        url: panoramaOrdersUrl + "disable",
        method: "post",
        data: params,
    });
}
