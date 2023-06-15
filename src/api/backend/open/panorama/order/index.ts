import createAxios from "/@/utils/axios";

const panoramaOrderUrl = "admin/open/panorama/task/";

export function getTaskList(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskDispatching(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "dispatching",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskTaking(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "taking",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskPackage(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "package",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskUpload(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "upload",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskOriginCheck(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "origin/check",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskRevisionView(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "revision/view",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskRevisionUpload(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "revision/upload",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskRevisionCheck(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "revision/check",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskPackaging(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "packaging",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskPackagingCheck(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "packaging/check",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskOnline(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "online",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getOrderInfo(params: any) {
    return createAxios({
        url: "admin/open/panorama/orders/query",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

//POST

export function updateTask(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "update",
        method: "post",
        data: params,
    });
}

export function dispatchTask(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "dispatching",
        method: "post",
        data: params,
    });
}

export function takeTask(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "taking",
        method: "post",
        data: params,
    });
}

export function passTaskOrigin(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "origin/pass",
        method: "post",
        data: params,
    });
}

export function uploadTaskOrigin(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "upload",
        method: "post",
        data: params,
    });
}

export function shootTaskOrigin(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "shoot",
        method: "post",
        data: params,
    });
}

export function rejectTaskOrigin(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "origin/reject",
        method: "post",
        data: params,
    });
}

export function passTaskRevision(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "revision/pass",
        method: "post",
        data: params,
    });
}

export function completeTaskRevision(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "revision",
        method: "post",
        data: params,
    });
}

export function uploadTaskRevision(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "revision/upload",
        method: "post",
        data: params,
    });
}

export function RejectTaskRevision(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "revision/reject",
        method: "post",
        data: params,
    });
}

export function completeTaskPackaging(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "packaging",
        method: "post",
        data: params,
    });
}

export function passTaskPackaging(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "packaging/pass",
        method: "post",
        data: params,
    });
}

export function rejectTaskPackaging(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "packaging/reject",
        method: "post",
        data: params,
    });
}

export function postTaskOnline(params: any) {
    return createAxios({
        url: panoramaOrderUrl + "online",
        method: "post",
        data: params,
    });
}
