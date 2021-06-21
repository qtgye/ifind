import { ADMIN_API_ROOT } from '@config/adminApi'

export const toAdminURL = (relativeURL = '') => (
    ADMIN_API_ROOT.split(/\//g).slice(0, 3).join('/') +
    relativeURL.replace(/^\/+/, '/')
)