import createAxios from '/@/utils/axios'

const generalURl = '/common/general/'

export function generalConfig(params: any) {
    return createAxios({
        url: generalURl + 'config',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}


