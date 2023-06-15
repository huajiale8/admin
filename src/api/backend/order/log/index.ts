import createAxios from "/@/utils/axios";

const logUrl = "admin/order/";

export function importLogList(params: { page: number, pageSize: number, name?: string }) {
    return createAxios({
        url: logUrl + "import/lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}

export function exportLogList(params: { page: number, pageSize: number, name?: string }) {
    return createAxios({
        url: logUrl + "export/lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}
