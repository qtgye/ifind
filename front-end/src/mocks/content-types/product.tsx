export const amazonProductWithoutAttributes = {
  id: "47710",
  amazon_url:
    "https://www.amazon.de/Wurstpaket-ger%C3%A4uchert-Leberwurst-Preiselbeeren-Rauchwurst/dp/B07JHCGZ1J?ref=dlx_deals_gd_dcl_img_20_5cd07946_dt_sl14_18&tag=ifindilu08-21",
  price: 29.74,
  price_original: 34.99,
  discount_percent: 15,
  quantity_available_percent: 86,
  title:
    "Wurstpaket Geschenk | Schinken Salami Set | Lende geräuchert Leberwurst Preiselbeeren | BBQ Rauchwurst Schlemmer Box | Wurstgeschenk für Männer & Familie",
  deal_type: "amazon_flash_offers" as ENUM_PRODUCT_DEAL_TYPE,
  image: "https://m.media-amazon.com/images/I/81zOFLt3WKL._SX522_.jpg",
  url_list: [],
};

export const ebayWowOfferProduct = {
  id: "47760",
  title:
    "Creatable 22861 Serie MALLORCA Geschirrset Kombiservice 16tlg Steinzeug",
  deal_type: "ebay_wow_offers" as ENUM_PRODUCT_DEAL_TYPE,
  image: "https://i.ebayimg.com/images/g/-g0AAOSw9JVhOcxp/s-l640.jpg",
  url_list: [
    {
      id: "123",
      source: {
        id: "123",
        name: "Ebay",
        created_at: "",
        updated_at: "",
      },
      price: 81.99,
      url:
        "https://www.ebay.de/itm/274939830992?campid=5338787715&mkevt=1&mkcid=1&toolid=10001&mkrid=707-53477-19255-0",
      price_original: 149.99,
      discount_percent: 45,
      quantity_available_percent: 27,
    },
  ],
};

export const aliExpressValueDealProduct = {
  id: "13809",
  title:
    "Laptop Bag Sleeve Case Protective Shoulder Carrying Case For pro 13 14 15.6 17 inch Macbook Air ASUS Lenovo Dell Huawei handbag",
  deal_type: "aliexpress_value_deals" as ENUM_PRODUCT_DEAL_TYPE,
  image: "https://ae04.alicdn.com/kf/H6d7e67ca7a4746c29f44c3d89573248b3.jpg",
  url_list: [
    {
      id: "123",
      source: {
        id: "2",
        name: "AliExpress",
        created_at: "",
        updated_at: "",
      },
      price: 14.16,
      url: "https://s.click.aliexpress.com/e/_vlIahg",
      price_original: 28.34,
      discount_percent: 50,
    },
  ],
};
