import createAxios from '/@/utils/axios'

const categoryUrl = '/admin/system/attributes/category/'

export function categoryLists(params: any) {
    return createAxios({
        url: categoryUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function categoryDelete(data: any) {
    return createAxios({
        url: categoryUrl + 'delete',
        method: 'post',
        data
    })
}

export function addCateApi(params: any) {
    return createAxios({
        url: categoryUrl + 'update',
        method: 'post',
        data: params
    })
}

export function categoryDetail(params: any) {
    return createAxios({
        url: categoryUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function categoryDisable(params: any) {
    return createAxios({
        url: categoryUrl + 'disable',
        method: 'post',
        data: params,
    })
}

export function categoryEnable(params: any) {
    return createAxios({
        url: categoryUrl + 'enable',
        method: 'post',
        data: params
    })
}
