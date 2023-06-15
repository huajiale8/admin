import createAxios from '/@/utils/axios'

const projectTypeUrl = 'admin/publish/project/type/'
export function typeLists(params: any) {
    return createAxios({
        url: projectTypeUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function typeUpdate(params: any) {
    return createAxios({
        url: projectTypeUrl + 'update',
        method: 'post',
        data: params
    })
}

export function typeDelete(params: any) {
    return createAxios({
        url: projectTypeUrl + 'delete',
        method: 'post',
        data: params
    })
}

