import createAxios from "/@/utils/axios";

export function uploadFile(params: FormData) {
    return createAxios({
        url: "/common/upload/file",
        method: "post",
        data: params,
    });
}

export function getAreaList() {
    return createAxios({
        url: "common/area/province",
        method: "get",
        data: {noSuccessMessage: true},
    });
}

export function getCategoryList() {
    return createAxios({
        url: "common/categories",
        method: "get",
        data: {noSuccessMessage: true},
    });
}
