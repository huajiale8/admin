import createAxios from '/@/utils/axios'

const hotspotUrl = 'admin/portal/data/hotspot/'

export function hotspotLists(params: any) {
    return createAxios({
        url: hotspotUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
