import createAxios from '/@/utils/axios'
import {ElMessage} from 'element-plus'

const quoteOrderUrl = '/admin/quote/order/'
const accountUrl = '/admin/quote/account/'

export function orderLists(params: any) {
    return createAxios({
        url: quoteOrderUrl + 'lists',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function orderDetail(params: any) {
    return createAxios({
        url: quoteOrderUrl + 'detail',
        method: 'get',
        params,
        data: {noSuccessMessage: true}

    })
}

export function orderPass(params: any) {
    return createAxios({
        url: quoteOrderUrl + 'pass',
        method: 'post',
        data: params
    })
}

export function orderReject(params: any) {
    return createAxios({
        url: quoteOrderUrl + 'reject',
        method: 'post',
        data: params
    })
}

export function orderClose(params: any) {
    return createAxios({
        url: quoteOrderUrl + 'close',
        method: 'post',
        data: params
    })
}

export function apiExport(params: any) {
    return createAxios({
        url: quoteOrderUrl + 'detail',
        method: 'get',
        params,
        responseType: 'blob'
    }).then(res => {
        const blob = new Blob([res.data], {
            type: "application/pdf;charset=utf-8",
        });
        const blobURL = window.URL.createObjectURL(blob)
        const tempLink = document.createElement("a")
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", params.name);
        if (typeof tempLink.download === "undefined") {
            tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
        ElMessage({
            message: '导出成功.',
            type: 'success',
        })
    })

}


export function orderQuery(params: any) {
    return createAxios({
        url: accountUrl + 'query',
        method: 'get',
        params,
        data: {noSuccessMessage: true}
    })
}

export function orderSave(params: any) {
    return createAxios({
        url: quoteOrderUrl + 'save',
        method: 'post',
        data: params
    })
}



