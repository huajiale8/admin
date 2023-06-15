import createAxios from '/@/utils/axios'

const authBankUrl = '/admin/auth/bank/'

export function bankLists(params: any) {
    return createAxios({
        url: authBankUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function detailLists(params: any) {
    return createAxios({
        url: authBankUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function rejectLists(params: any) {
    return createAxios({
        url: authBankUrl + 'reject',
        method: 'post',
        data: params
    })
}

export function passLists(params: any) {
    return createAxios({
        url: authBankUrl + 'pass',
        method: 'post',
        data: params
    })
}
