import createAxios from "/@/utils/axios";

const capitalUrl = "admin/open/capital/";

export function capitalList(params: {
    page: number,
    pageSize: number,
    email?: string,
    type?: number,
    enterprise_name?: string
}) {
    return createAxios({
        url: capitalUrl + "lists",
        method: "get",
        params,
        data: {noSuccessMessage: true},
    });
}
