import createAxios from '/@/utils/axios'

const systemConfigUrl = '/admin/system/config/'

export function updateConfig(params: any) {
    return createAxios({
        url: systemConfigUrl + 'save',
        method: 'post',
        data: params
    })
}

export function detailConfig() {
    return createAxios({
        url: systemConfigUrl + 'detail',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

