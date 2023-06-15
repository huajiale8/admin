import createAxios from '/@/utils/axios'

const attributesPlaceUrl = '/admin/system/attributes/place/'

export function placeLists(params: any) {
    return createAxios({
        url: attributesPlaceUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function placeUpdate(params: any) {
    return createAxios({
        url: attributesPlaceUrl + 'update',
        method: 'post',
        data: params
    })
}

