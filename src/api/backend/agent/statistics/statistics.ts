import createAxios from '/@/utils/axios'

const agentStatisticsUrl = '/admin/agent/statistics/'

export function agentStatisticsList(params: any) {
    return createAxios({
        url: agentStatisticsUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}
