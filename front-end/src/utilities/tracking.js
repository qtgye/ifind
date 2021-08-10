export const trackClick = (element, fields) => {
    if ( window.ga ) {
        window.ga('send', {
            hitType: 'event',
            eventCategory: fields.category || 'Product',
            eventAction: fields.action || 'click',
            eventLabel: element.textContent,
        });
    }
};