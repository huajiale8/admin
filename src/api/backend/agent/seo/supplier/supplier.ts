import createAxios from '/@/utils/axios'

const seoSupplierUrl = '/admin/agent/seo/supplier/'

export function agentSeoSupplierList(params: any) {
    return createAxios({
        url: seoSupplierUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoSupplierDetail(params: any) {
    return createAxios({
        url: seoSupplierUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentSeoSupplierSave(params: any) {
    return createAxios({
        url: seoSupplierUrl + 'save',
        method: 'post',
        data: params,

    })
}
