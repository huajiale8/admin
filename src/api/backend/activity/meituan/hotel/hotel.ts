import createAxios from '/@/utils/axios'

const meiTuanHotelUrl = '/admin/activity/meituan/hotel/'

export function meiTuanHotelLists(params: any) {
    return createAxios({
        url: meiTuanHotelUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}


export function meiTuanHotel(params: any, _method: string) {
    return createAxios({
        url: meiTuanHotelUrl + _method,
        method: 'post',
        data: params
    })
}

export function meiTuanHotelImport(params: any) {
    return createAxios({
        url: meiTuanHotelUrl + 'import',
        method: 'post',
        data: params
    })
}

export function meiTuanHotelUp(params: any) {
    return createAxios({
        url: '/common/upload/file',
        method: 'post',
        data: params
    })
}





