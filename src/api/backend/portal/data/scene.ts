import createAxios from '/@/utils/axios'

const sceneUrl = 'admin/portal/data/scene/'

export function sceneLists(params: any) {
    return createAxios({
        url: sceneUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
