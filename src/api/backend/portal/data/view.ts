import createAxios from '/@/utils/axios'

const viewUrl = 'admin/portal/data/view/'

export function viewLists(params: any) {
    return createAxios({
        url: viewUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
