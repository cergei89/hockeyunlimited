function huInitCategorySchema() {
  // 1. Guard: Exit if this is a single product page
  if (document.querySelector('.ProductDetails')) return;

  function buildOrUpdateSchema() {
    // Target the product links inside the Vilkas category grid container
    const productLinks = document.querySelectorAll('.ProductListImageBox h3.TopPaddingWide > a');
    if (!productLinks.length) return;

    const itemListElements = [];

    productLinks.forEach((linkEl, index) => {
      const rawHref = linkEl.getAttribute('href');
      console.log("h3.TopPaddingWide > a " + rawHref);
      if (!rawHref) return;

      const fullUrl = new URL(rawHref, window.location.href).href;
      console.log("window.location.href " + window.location.href);
      const productName = linkEl.innerText.trim();

      // Find the parent container (table cell or box) for this specific product
      const cardEl = linkEl.closest('td') || linkEl.closest('.ProductListImageBox') || linkEl.parentElement;

      // Extract product image
      const imgEl = cardEl?.querySelector('img');
      const image = imgEl?.src || '';

      // Extract active price (checks itemprop first, then falls back to .price-value text)
      let price = cardEl?.querySelector('[itemprop="price"]')?.getAttribute('content') || '';
      if (!price) {
        const priceRaw = cardEl?.querySelector('.price-value')?.innerText || '';
        price = priceRaw
          .replace(/[^\d,.-]/g, '')
          .replace(/\./g, '')
          .replace(',', '.');
      }

      const currency = cardEl?.querySelector('[itemprop="priceCurrency"]')?.getAttribute('content') || 'EUR';

      // Extract and clean strikethrough/old price if it exists
      const oldPriceEl = cardEl?.querySelector('.LineThrough');
      let oldPrice = null;
      if (oldPriceEl) {
        const oldPriceRaw = oldPriceEl.innerText || '';
        oldPrice = oldPriceRaw
          .replace(/[^\d,.-]/g, '')
          .replace(/\./g, '')
          .replace(',', '.');
      }

      // Build Offer object
      const offersObj = {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency
      };

      // Attach strikethrough price specification if found
      if (oldPrice && !isNaN(parseFloat(oldPrice))) {
        offersObj.priceSpecification = {
          "@type": "UnitPriceSpecification",
          "priceType": "https://schema.org/StrikethroughPrice",
          "price": oldPrice,
          "priceCurrency": currency
        };
      }

      // Build nested Product inside ListItem
      const productItem = {
        "@type": "Product",
        "name": productName,
        "url": fullUrl,
        "offers": offersObj
      };

      if (image) {
        productItem.image = image;
      }

      itemListElements.push({
        "@type": "ListItem",
        "position": index + 1,
        "item": productItem
      });
    });

    if (!itemListElements.length) return;

    // Extract category metadata from the page
    const categoryName = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || document.title;

    console.log("h1 " + categoryName);

    const categoryDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    const canonicalUrl = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

    // Build CollectionPage + ItemList JSON-LD
    const categorySchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": categoryName,
      "description": categoryDesc,
      "url": canonicalUrl,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": itemListElements.length,
        "itemListElement": itemListElements
      }
    };

    // Update existing script or inject a new one into <head>
    let script = document.getElementById('hu-category-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'hu-category-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(categorySchema);
  }

  // Run immediately for whatever is already rendered
  buildOrUpdateSchema();

  // Watch for dynamically loaded products in the main content area
  const mainContent = document.querySelector('#main-content') || document.body;
  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(buildOrUpdateSchema, 300);
  });

  observer.observe(mainContent, {
    childList: true,
    subtree: true
  });
}

// Run once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', huInitCategorySchema);
} else {
  huInitCategorySchema();
}
