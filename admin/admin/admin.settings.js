import { generatePluginLink } from '@plugins/ifind/admin/src/helpers/url';

export const leftCollectionMenu = [
  {
    pattern: /product/,
    override: {
      icon: 'shopping-bag',
      destination: generatePluginLink('/products'),
    }
  },
  {
    pattern: /category/,
    override: {
      icon: 'sitemap',
      destination: generatePluginLink('/categories'),
    }
  },
  {
    pattern: /source/,
    override: {
      icon: 'external-link-alt'
    }
  },
  {
    pattern: /region/,
    override: {
      icon: 'globe-americas'
    }
  },
  {
    pattern: /currency/,
    override: {
      icon: 'dollar-sign'
    }
  },
  {
    pattern: /language/,
    override: {
      icon: 'language'
    }
  },
  {
    pattern: /page/,
    override: {
      icon: 'book'
    }
  },
  {
    pattern: /user/,
    override: {
      icon: 'users'
    }
  }
]
