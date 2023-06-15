import createAxios from "/@/utils/axios";

const planeTaskUrl = "admin/open/plane/task/";

export function getTaskList(params: any) {
    return createAxios({
        url: planeTaskUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskDispatching(params: any) {
    return createAxios({
        url: planeTaskUrl + "dispatching",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskTaking(params: any) {
    return createAxios({
        url: planeTaskUrl + "taking",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskPackage(params: any) {
    return createAxios({
        url: planeTaskUrl + "package",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskUpload(params: any) {
    return createAxios({
        url: planeTaskUrl + "upload",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskOriginCheck(params: any) {
    return createAxios({
        url: planeTaskUrl + "origin/check",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskRevisionView(params: any) {
    return createAxios({
        url: planeTaskUrl + "revision/view",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskRevisionUpload(params: any) {
    return createAxios({
        url: planeTaskUrl + "revision/upload",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskRevisionCheck(params: any) {
    return createAxios({
        url: planeTaskUrl + "revision/check",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getOrderQuery(params: any) {
    return createAxios({
        url: "admin/open/plane/orders/query",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function getTaskCustom(params: any) {
    return createAxios({
        url: planeTaskUrl + "custom",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

//POST

export function updateTask(params: any) {
    return createAxios({
        url: planeTaskUrl + "update",
        method: "post",
        data: params,
    });
}

export function dispatchTask(params: any) {
    return createAxios({
        url: planeTaskUrl + "dispatching",
        method: "post",
        data: params,
    });
}

export function takeTask(params: any) {
    return createAxios({
        url: planeTaskUrl + "taking",
        method: "post",
        data: params,
    });
}

export function passTaskOrigin(params: any) {
    return createAxios({
        url: planeTaskUrl + "origin/pass",
        method: "post",
        data: params,
    });
}

export function uploadTaskOrigin(params: any) {
    return createAxios({
        url: planeTaskUrl + "upload",
        method: "post",
        data: params,
    });
}

export function shootTaskOrigin(params: any) {
    return createAxios({
        url: planeTaskUrl + "shoot",
        method: "post",
        data: params,
    });
}

export function rejectTaskOrigin(params: any) {
    return createAxios({
        url: planeTaskUrl + "origin/reject",
        method: "post",
        data: params,
    });
}

export function passTaskRevision(params: any) {
    return createAxios({
        url: planeTaskUrl + "revision/pass",
        method: "post",
        data: params,
    });
}

export function completeTaskRevision(params: any) {
    return createAxios({
        url: planeTaskUrl + "revision",
        method: "post",
        data: params,
    });
}

export function uploadTaskRevision(params: any) {
    return createAxios({
        url: planeTaskUrl + "revision/upload",
        method: "post",
        data: params,
    });
}

export function RejectTaskRevision(params: any) {
    return createAxios({
        url: planeTaskUrl + "revision/reject",
        method: "post",
        data: params,
    });
}
export function postTaskOnline(params: any) {
    return createAxios({
        url: planeTaskUrl + "online",
        method: "post",
        data: params,
    });
}

export function confirmTaskCustom(params: any) {
    return createAxios({
        url: planeTaskUrl + "custom",
        method: "post",
        data: params,
    });
}

