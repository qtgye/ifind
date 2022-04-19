import { useCallback, useEffect } from "react";

const VendorScripts = () => {
  const injectCookieBanner = useCallback(() => {
    const script = document.createElement('script');
    script.src = '//cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js';
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);

    const cookieBannerContainer = document.getElementById("cookie-banner");

    if ( !cookieBannerContainer ) {
      return;
    }

    if ( cookieBannerContainer.hasChildNodes() ) {
      cookieBannerContainer.innerHTML = '';
    }

    window.cookieconsent?.initialise({
      container: document.getElementById("cookie-banner"),
      "palette": {
        "popup": {
          "background": "#3c404d",
          "text": "#d6d6d6"
        },
        "button": {
          "background": "transparent",
          "text": "#8bed4f",
          "border": "#8bed4f",
        },
      },
      position: "bottom-right",
      type: "opt-in",
      content: {
        message: "Diese Website verwendet eigene Cookies und Cookies von Dritten für Analysen und Werbung. Wenn Sie Ihren Besuch fortsetzen, stimmen Sie der Verwendung solcher Cookies zu. Mehr Informationen dazu findet Ihr unter",
        link: "Data-protection",
        allow: 'Einverstanden',
        deny: 'Nicht Einverstanden',
        href: "/data-protection"
      },

      revokable: true,
      onStatusChange: function () {
        // console.log(this.hasConsented() ?
        //   'enable cookies' : 'disable cookies');
      },
      law: {
        regionalLaw: false,
      },
      location: true,
    });
  }, []);

  useEffect(() => {
    injectCookieBanner();
  });

  // Nothing needs to be rendered
  return null;
};

export default VendorScripts;
