function huInitProductSchema() {
  function buildOrUpdateProductSchema() {
    // 1. Extract core metadata from Open Graph & DOM
    const name = document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() || document.title;

    const description = document.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim()
      || document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()

    const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim() || '';
    const url = document.querySelector('meta[property="og:url"]')?.getAttribute('content')?.trim()
      || document.querySelector('link[rel="canonical"]')?.href;

    const mainArea = document.querySelector('#main-content') || document.body;

    // 2. Extract Brand directly from <meta itemprop="brand">
    const detectedBrand = document.querySelector('[itemprop="brand"]')?.getAttribute('content')?.trim() || '';

       // 3. Extract Active Price from <span itemprop="price" content="169.15">169,15</span>
    const priceEl = mainArea.querySelector('[itemprop="price"]');
    let price = priceEl?.getAttribute('content')?.trim() || '';

    const currency = mainArea.querySelector('[itemprop="priceCurrency"]')?.getAttribute('content')?.trim() || '';

    // 4. Extract Old / Strikethrough Price ONLY from the main product's .PriceContainer
    let oldPrice = null;
    const priceContainer = priceEl?.closest('.PriceContainer') || mainArea.querySelector('.PriceContainer');
    const oldPriceEl = priceContainer?.querySelector('span.LineThrough, .LineThrough');
    if (oldPriceEl) {
      const oldPriceRaw = oldPriceEl.textContent || '';
      oldPrice = oldPriceRaw
        .replace(/[^\d,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.');
    }

    // 5. Build Offer Object
    const offersObj = {
      "@type": "Offer",
      "url": url,
      "priceCurrency": currency,
      "price": price
    };

    if (oldPrice && !isNaN(parseFloat(oldPrice)) && oldPrice !== price) {
      offersObj.priceSpecification = {
        "@type": "UnitPriceSpecification",
        "priceType": "https://schema.org/StrikethroughPrice",
        "price": oldPrice,
        "priceCurrency": currency
      };
    }

    // 6. Build Product Schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": description,
      "url": url,
      "offers": offersObj
    };

    if (image) {
      productSchema.image = image;
    }

    if (detectedBrand) {
      productSchema.brand = {
        "@type": "Brand",
        "name": detectedBrand
      };
    }

    // 7. Inject or update in <head>
    let script = document.getElementById('hu-product-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'hu-product-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(productSchema);
  }

  // Run immediately once DOM is ready
  buildOrUpdateProductSchema();

  // Watch for dynamic variant selection updates
  const mainContent = document.querySelector('#main-content') || document.body;
  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(buildOrUpdateProductSchema, 300);
  });

  observer.observe(mainContent, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', huInitProductSchema);
} else {
  huInitProductSchema();
}
