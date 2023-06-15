import createAxios from '/@/utils/axios'

const sourceAudioUrl = 'admin/portal/source/audio/'

export function audioLists(params: any) {
    return createAxios({
        url: sourceAudioUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function enable(params: any) {
    return createAxios({
        url: sourceAudioUrl + 'enable',
        method: 'post',
        data: params
    })
}

export function disable(params: any) {
    return createAxios({
        url: sourceAudioUrl + 'disable',
        method: 'post',
        data: params
    })
}

