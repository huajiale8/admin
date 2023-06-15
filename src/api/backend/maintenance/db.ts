import createAxios from '/@/utils/axios'

const maintenanceDbUrl = 'admin/maintenance/db/'

export function maintenanceTablesLists() {
    return createAxios({
        url: maintenanceDbUrl + 'tables',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function maintenanceLogExport(params: any) {
    return createAxios({
        url: maintenanceDbUrl + 'export',
        method: 'post',
        data: params
    })
}

