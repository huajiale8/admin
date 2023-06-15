import createAxios from '/@/utils/axios'

const portalBannerUrl = 'admin/portal/banner/'

export function bannerLists(params: any) {
    return createAxios({
        url: portalBannerUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function detailLists(params: any) {
    return createAxios({
        url: portalBannerUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function updateLists(params: any) {
    return createAxios({
        url: portalBannerUrl + 'update',
        method: 'post',
        data: params
    })
}

export function bannerDeleteLists(params: any) {
    return createAxios({
        url: portalBannerUrl + 'delete',
        method: 'post',
        data: params
    })
}
