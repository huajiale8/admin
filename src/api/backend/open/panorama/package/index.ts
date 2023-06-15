import createAxios from "/@/utils/axios";

const panoramaPackageUrl = "admin/open/panorama/package/";

export function getPackageList(params: any) {
    return createAxios({
        url: panoramaPackageUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getPackageDetail(params: any) {
    return createAxios({
        url: panoramaPackageUrl + "detail",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getPackageParents() {
    return createAxios({
        url: panoramaPackageUrl + "parents",
        method: "get",
        data: {noSuccessMessage: true},
    });
}

export function getPackageDistribution(params: any) {
    return createAxios({
        url: panoramaPackageUrl + "distribution",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getPackageDelete(params: any) {
    return createAxios({
        url: panoramaPackageUrl + "delete",
        method: "post",
        data: params,
    });
}

export function getPackageUpdate(params: any) {
    return createAxios({
        url: panoramaPackageUrl + "update",
        method: "post",
        data: params,
    });
}

export function getPackageDistributionPost(params: any) {
    return createAxios({
        url: panoramaPackageUrl + "distribution",
        method: "post",
        data: params,
    });
}
