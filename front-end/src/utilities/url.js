import { ADMIN_API_ROOT } from '@config/adminApi'

/**
 * 
 * @param {String} relativeURL - the relative pathname
 * @returns {String}
 */
export const toAdminURL = (relativeURL = '') => (
    ADMIN_API_ROOT
        .split(/\//g)
        .slice(0, 3)
        .join('/') +
    relativeURL
        .replace(/^\/+/, '/')
)