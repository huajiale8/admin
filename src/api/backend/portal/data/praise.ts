import createAxios from '/@/utils/axios'

const praiseUrl = 'admin/portal/data/praise/'

export function praiseLists(params: any) {
    return createAxios({
        url: praiseUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
