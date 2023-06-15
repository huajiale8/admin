import createAxios from '/@/utils/axios'

const portalCaseUrl = 'admin/portal/case/'
const areaUrl = 'common/area/'

export function caseLists(params: any) {
    return createAxios({
        url: portalCaseUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function detailLists(params: any) {
    return createAxios({
        url: portalCaseUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function updateLists(params: any) {
    return createAxios({
        url: portalCaseUrl + 'update',
        method: 'post',
        data: params
    })
}

export function caseDeleteLists(params: any) {
    return createAxios({
        url: portalCaseUrl + 'delete',
        method: 'post',
        data: params
    })
}

export function areaCity(params: any) {
    return createAxios({
        url: areaUrl + 'city',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function areaCounty(params: any) {
    return createAxios({
        url: areaUrl + 'county',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
