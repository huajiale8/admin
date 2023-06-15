import createAxios from '/@/utils/axios'

const systemMenuURl = '/admin/system/menu/'

export function roleMenu() {
    return createAxios({
        url: systemMenuURl + 'roleMenu',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}
