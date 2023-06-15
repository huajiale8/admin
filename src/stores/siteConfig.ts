import {defineStore} from 'pinia'
import {SiteConfig} from '/@/stores/interface'

export const useSiteConfig = defineStore('siteConfig', {
    state: (): SiteConfig => {
        return {
            site_info: {
                site_name: '',
                site_title: '',
                site_status: '',
                site_logo: '',
                site_keywords: '',
                site_icp: '',
                site_desc: '',
                site_company_name: '',
                site_company_address: '',
                site_contact_phone: '',
                site_contact_email: '',
                site_contact_wechat: '',
                site_contact_qq: '',

            },
            cdn_url: '',
            domain: '',
            site_icp: '',
            version_control: '',
            upload: {
                mimetype: ''
            }
        }
    },
    actions: {
        dataFill(state: SiteConfig) {
            this.$state = state
        },
    },
})
