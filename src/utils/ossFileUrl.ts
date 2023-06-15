const mode = import.meta.env.MODE
export default function ossfileUrl() {
    let url = ''
    if (mode === '_local') {
        url = 'oss/file/upload'
    } else {
        url = 'https://oss.818qj.com/file/upload'
    }
    return url
}
