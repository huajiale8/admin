const mode = import.meta.env.MODE

export default function ossUrl() {
    let url = ''
    if (mode === '_local') {
        url = 'oss/picture/upload'
    } else {
        url = 'https://oss.818qj.com/picture/upload'
    }
    return url
}
