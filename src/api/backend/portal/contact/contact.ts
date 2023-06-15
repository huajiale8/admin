import createAxios from '/@/utils/axios'

const contactUrl = 'admin/portal/contact/'

export function contactLists(params: any) {
    return createAxios({
        url: contactUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

