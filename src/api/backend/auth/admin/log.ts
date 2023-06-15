import createAxios from '/@/utils/axios'

const logUrl = '/admin/admin/log/'

export function logLists(params: any) {
    return createAxios({
        url: logUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
