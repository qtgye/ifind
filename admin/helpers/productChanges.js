const { compareAttributeChanges } = require('./productAttribute');

/**
 * Compares original product data against changed product data,
 * @return {object} product data containing only changed properties
 */
const compareProductChanges = (originalData, changedData) => {
  // Get changes
  const changesList = Object.entries(changedData).filter(([formKey]) => {
    switch (formKey) {
      case 'categories':
        return (
          (originalData.categories && changedData.categories) &&
          (
            (originalData.categories.length !== changedData.categories.length) ||
            (originalData.categories[0].id != changedData.categories[0])
          )
        );
      case 'url_list':
        return (
          // Check if urls count is changed
          (originalData.url_list && originalData.url_list.length !== changedData.url_list.length)
          || (
            changedData.url_list && changedData.url_list.some((changedURLData, index) => {
              const originalURLData = originalData.url_list[index];
              return (
                originalURLData.price != changedURLData.price ||
                originalURLData.region.id != changedURLData.region ||
                originalURLData.source.id != changedURLData.source ||
                originalURLData.url != changedURLData.url
              )
            })
          )
        );
      case 'attrs_rating':
          return (
            (originalData.attrs_rating && changedData.attrs_rating) && (
              // Check if count has changed
              (originalData.attrs_rating.length !== changedData.attrs_rating.length) ||
              // Check if each item has changed
              (
                originalData.attrs_rating.some(originalAttrRating => {
                  const matchedChangedRating = changedData.attrs_rating.find(({ id }) => id == originalAttrRating.id);

                  // Attribute must have been removed on change
                  if ( !matchedChangedRating ) { return true; }
                  return compareAttributeChanges(originalAttrRating, matchedChangedRating);
                })
              )
            )
          )
      case 'title':
      case 'website_tab':
      case 'price':
      case 'image':
      case 'amazon_url':
      case 'position':
      case 'final_rating':
      case 'details_html':
        return changedData[formKey] != originalData[formKey];
      default:;
    }

    return false;
  });

  const changes = changesList.length ? (
    changesList.reduce((changesObj, [ key, value ]) => {
      changesObj[key] = value;
      return changesObj;
    }, {})
  ) : null;

  return changes;
}

module.exports = {
  compareProductChanges
};
