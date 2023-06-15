import createAxios from '/@/utils/axios'

const serviceItemsUrl = '/admin/quote/service/items/'

export function itemsLists(params: any) {
    return createAxios({
        url: serviceItemsUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function itemsEnable(params: any) {
    return createAxios({
        url: serviceItemsUrl + 'enable',
        method: 'POST',
        data: params
    })
}

export function itemsForbidden(params: any) {
    return createAxios({
        url: serviceItemsUrl + 'forbidden',
        method: 'POST',
        data: params
    })
}

export function itemsSave(params: any) {
    return createAxios({
        url: serviceItemsUrl + 'save',
        method: 'POST',
        data: params
    })
}

export function itemsDetail(params: any) {
    return createAxios({
        url: serviceItemsUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

