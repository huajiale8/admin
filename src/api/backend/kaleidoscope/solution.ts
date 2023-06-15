import createAxios from '/@/utils/axios'

const solutionUrl = '/admin/kaleidoscope/solution/'

export function kaleidoscopeSolutionLists(params: any) {
    return createAxios({
        url: solutionUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function kaleidoscopeSolutionDetail(params: any) {
    return createAxios({
        url: solutionUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function kaleidoscopeSolutionSave(params: any) {
    return createAxios({
        url: solutionUrl + 'save',
        method: 'post',
        data: params
    })
}

export function kaleidoscopeSolutionDelete(params: any) {
    return createAxios({
        url: solutionUrl + 'delete',
        method: 'post',
        data: params
    })
}

