import createAxios from '/@/utils/axios'

const dashboardAgentUrl = '/admin/dashboard/agent/'

export function dashboardAgentLists() {
    return createAxios({
        url: dashboardAgentUrl + 'agent',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardCustomLists() {
    return createAxios({
        url: dashboardAgentUrl + 'custom',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardKeywordLists() {
    return createAxios({
        url: dashboardAgentUrl + 'keyword',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardTaskLists() {
    return createAxios({
        url: dashboardAgentUrl + 'task',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardOrderLists() {
    return createAxios({
        url: dashboardAgentUrl + 'order',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardMemberLists() {
    return createAxios({
        url: dashboardAgentUrl + 'member',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardApiKeywordLists() {
    return createAxios({
        url: dashboardAgentUrl + 'api/keyword',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardApiTaskLists() {
    return createAxios({
        url: dashboardAgentUrl + 'api/task',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardApiOrderLists() {
    return createAxios({
        url: dashboardAgentUrl + 'api/order',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardChartLists() {
    return createAxios({
        url: dashboardAgentUrl + 'chart',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardApiChartLists() {
    return createAxios({
        url: dashboardAgentUrl + 'api/chart',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardHotelDaysLists() {
    return createAxios({
        url: 'admin/dashboard/activity/hotel/days',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardHotelCitiesLists() {
    return createAxios({
        url: 'admin/dashboard/activity/hotel/cities',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardHotelSalesmanLists() {
    return createAxios({
        url: 'admin/dashboard/activity/hotel/salesman',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}

export function dashboardHotelTotalLists() {
    return createAxios({
        url: 'admin/dashboard/activity/hotel/total',
        method: 'get',
        data: {noSuccessMessage: true}
    })
}
