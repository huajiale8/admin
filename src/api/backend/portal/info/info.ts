import createAxios from '/@/utils/axios'

const infoCollectUrl = 'admin/portal/infoCollect/'

export function infoCollectLists(params: any) {
    return createAxios({
        url: infoCollectUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

