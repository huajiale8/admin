import createAxios from '/@/utils/axios'

const kaleidoscopeLabelUrl = '/admin/kaleidoscope/label/'

export function kaleidoscopeLabelLists(params: any) {
    return createAxios({
        url: kaleidoscopeLabelUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function kaleidoscopeLabelSave(params: any) {
    return createAxios({
        url: kaleidoscopeLabelUrl + 'save',
        method: 'post',
        data: params
    })
}
