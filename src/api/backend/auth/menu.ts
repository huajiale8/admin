import createAxios from "/@/utils/axios";

const authMenu = "/admin/system/menu/";

export function menuLists(pid ?: number) {
    return createAxios({
        url: authMenu + "lists",
        method: "get",
        params: {
            pid: pid,
        },
        data: {noSuccessMessage: true},
    });
}

export function MenuDetailApi(params: any) {
    return createAxios({
        url: authMenu + "detail",
        method: "get",
        params,
        data: {noSuccessMessage: true},

    });
}

export function MenuUpdateApi(params: any) {
    return createAxios({
        url: authMenu + "update",
        method: "post",
        data: params,
    });
}
export function MenuEnableApi(params: any,item:string) {
    return createAxios({
        url: authMenu + item,
        method: "post",
        data: params,
    });
}

