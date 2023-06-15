import createAxios from '/@/utils/axios'

const arSkuUrl = '/admin/agent/order/ar/sku/'

export function agentOrderArSkuList(params: any) {
    return createAxios({
        url: arSkuUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentOrderArSkuExport(params: any) {
    return createAxios({
        url: arSkuUrl + 'lists',
        method: 'get',
        params,
        responseType: 'blob',
    })
}

