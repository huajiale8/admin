import createAxios from '/@/utils/axios'

const serviceCategoryUrl = '/admin/quote/service/category/'

export function categoryLists(params: any) {
    return createAxios({
        url: serviceCategoryUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function categoryEnable(params: any) {
    return createAxios({
        url: serviceCategoryUrl + 'enable',
        method: 'POST',
        data: params
    })
}

export function categoryForbidden(params: any) {
    return createAxios({
        url: serviceCategoryUrl + 'forbidden',
        method: 'POST',
        data: params
    })
}

export function categorySave(params: any) {
    return createAxios({
        url: serviceCategoryUrl + 'save',
        method: 'POST',
        data: params
    })
}
