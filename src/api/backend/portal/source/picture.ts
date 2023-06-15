import createAxios from '/@/utils/axios'

const pictureUrl = 'admin/portal/source/picture/'

export function pictureLists(params: any) {
    return createAxios({
        url: pictureUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function enable(params: any) {
    return createAxios({
        url: pictureUrl + 'enable',
        method: 'post',
        data: params
    })
}

export function disable(params: any) {
    return createAxios({
        url: pictureUrl + 'disable',
        method: 'post',
        data: params
    })
}

