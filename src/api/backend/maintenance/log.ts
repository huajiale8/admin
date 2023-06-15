import createAxios from '/@/utils/axios'

const maintenanceLogUrl = 'admin/maintenance/log/'

export function maintenanceLogLists() {
    return createAxios({
        url: maintenanceLogUrl + 'lists',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function maintenanceLogDetail(params: any) {
    return createAxios({
        url: maintenanceLogUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function maintenanceLogDelete(params: any) {
    return createAxios({
        url: maintenanceLogUrl + 'delete',
        method: 'post',
        data: params
    })
}

