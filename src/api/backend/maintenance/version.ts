import createAxios from '/@/utils/axios'

const versionUrl = 'admin/maintenance/version/'

export function maintenanceLogLists() {
    return createAxios({
        url: versionUrl + 'lists',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function maintenanceLogSave(params: any) {
    return createAxios({
        url: versionUrl + 'save',
        method: 'post',
        data: params
    })
}

