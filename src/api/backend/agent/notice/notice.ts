import createAxios from '/@/utils/axios'

const agentNoticeUrl = '/admin/agent/notice/'

export function agentNoticeList(params: any) {
    return createAxios({
        url: agentNoticeUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function agentNoticeDetail(params: any) {
    return createAxios({
        url: agentNoticeUrl + 'detail',
        method: 'get',
        data: {noSuccessMessage: true},
        params,
    })
}

export function agentNoticeSaveLists(params: any) {
    return createAxios({
        url: agentNoticeUrl + 'save',
        method: 'post',
        data: params,
    })
}
