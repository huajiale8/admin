import createAxios from '/@/utils/axios'

const quoteActivityUrl = '/admin/quote/activity/'

export function activityLists(params: any) {
    return createAxios({
        url: quoteActivityUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function activityEnable(params: any) {
    return createAxios({
        url: quoteActivityUrl + 'enable',
        method: 'POST',
        data: params
    })
}

export function activityForbidden(params: any) {
    return createAxios({
        url: quoteActivityUrl + 'forbidden',
        method: 'POST',
        data: params
    })
}

export function activitySave(params: any) {
    return createAxios({
        url: quoteActivityUrl + 'save',
        method: 'POST',
        data: params
    })
}

export function activityDetail(params: any) {
    return createAxios({
        url: quoteActivityUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

