export const trackClick = (element: HTMLElement, fields: {[key: string]: any}) => {
    if ( window.gtag ) {
        window.gtag('event', fields.action, {
            'event_category': fields.category,
            'event_label': fields.label || element.textContent,
            'value': element instanceof HTMLAnchorElement ? element.href : element.outerHTML,
        });
    }
};
