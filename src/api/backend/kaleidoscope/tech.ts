import createAxios from '/@/utils/axios'

const techUrl = '/admin/kaleidoscope/tech/'

export function kaleidoscopeTechLists(params: any) {
    return createAxios({
        url: techUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function kaleidoscopeTechSave(params: any) {
    return createAxios({
        url: techUrl + 'save',
        method: 'post',
        data: params
    })
}


