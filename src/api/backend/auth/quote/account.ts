import createAxios from '/@/utils/axios'

const quoteAccountUrl = '/admin/quote/account/'

export function accountLists(params: any) {
    return createAxios({
        url: quoteAccountUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function accountUpdate(params: any) {
    return createAxios({
        url: quoteAccountUrl + 'save',
        method: 'post',
        data: params
    })
}

export function accountDetail(params: any) {
    return createAxios({
        url: quoteAccountUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}


export function accountEnable(params: any) {
    return createAxios({
        url: quoteAccountUrl + 'enable',
        method: 'post',
        data: params
    })
}


export function accountDisable(params: any) {
    return createAxios({
        url: quoteAccountUrl + 'forbidden',
        method: 'post',
        data: params
    })
}

export function logsLists(params: any) {
    return createAxios({
        url: quoteAccountUrl + 'logs/lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function logsDiffLists(params: any) {
    return createAxios({
        url: quoteAccountUrl + 'logs/diff',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}



