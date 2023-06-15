import createAxios from '/@/utils/axios'

const arMerchantUrl = '/admin/activity/ar/merchant/'

export function merchantConfirmLists(params: any) {
    return createAxios({
        url: arMerchantUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function merchantConfirmExport(params: any) {
    return createAxios({
        url: arMerchantUrl + 'lists',
        method: 'get',
        params,
        responseType: 'blob',
        data: {noSuccessMessage: true}
    })
}



