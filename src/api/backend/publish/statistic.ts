import createAxios from '/@/utils/axios'

const statisticListsUrl = 'admin/publish/statistic/lists'
export function statisticMenuLists() {
    return createAxios({
        url: statisticListsUrl,
        method: 'get',
        data: {noSuccessMessage: true}
    })
}


