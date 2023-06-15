import createAxios from "/@/utils/axios";

const planePackageUrl = "admin/open/plane/package/";

export function getPlanePackageList(params: any) {
    return createAxios({
        url: planePackageUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getPlanePackageDetail(params: any) {
    return createAxios({
        url: planePackageUrl + "detail",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getPlanePackageDelete(params: any) {
    return createAxios({
        url: planePackageUrl + "delete",
        method: "post",
        data: params,
    });
}

export function getPlanePackageUpdate(params: any) {
    return createAxios({
        url: planePackageUrl + "update",
        method: "post",
        data: params,
    });
}
