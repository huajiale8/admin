import createAxios from '/@/utils/axios'

const serviceConfirmUrl = '/admin/activity/service/confirm/'
export function serviceConfirmLists(params: any) {
    return createAxios({
        url: serviceConfirmUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function serviceConfirmExport(params: any) {
    return createAxios({
        url: serviceConfirmUrl + 'lists',
        method: 'get',
        params,
        responseType: 'blob',
    })
}




