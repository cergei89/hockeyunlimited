function huInitProductSchema() {
  const mainProductMicrodata = document.querySelector('div[itemscope][itemtype="https://schema.org/Product"][itemprop="mainEntity"]');
if (mainProductMicrodata) {
  mainProductMicrodata.removeAttribute('itemscope');
  mainProductMicrodata.removeAttribute('itemtype');
}
  function buildOrUpdateProductSchema() {
    // 1. Extract core metadata from Open Graph & DOM
    const name = document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() || document.title;

    const description = document.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim()
      || document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim();

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
      let cleaned = (oldPriceEl.textContent || '').replace(/[^\d.,]/g, '');
      const lastComma = cleaned.lastIndexOf(',');
      const lastDot = cleaned.lastIndexOf('.');

      if (lastComma > lastDot) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else if (lastDot > lastComma) {
        cleaned = cleaned.replace(/,/g, '');
      }
      oldPrice = cleaned;
    }

    // 5. Extract Availability (Checks selected variation dropdown first, then epConfig, defaults to InStock)
    let availability = "https://schema.org/InStock"; 

    const selectedOption = mainArea.querySelector('select.VilkasSelect option:checked, select[id^="SelectedVariation"] option:checked');
    if (selectedOption && selectedOption.value) {
      const stockAlertAttr = selectedOption.getAttribute('data-stock-alert') || '';
      const optionClasses = selectedOption.className || '';
      
      if (stockAlertAttr === 'OUT_STOCK' || optionClasses.includes('STOCK_OUT_STOCK') || selectedOption.hasAttribute('data-out-of-stock')) {
        availability = "https://schema.org/OutOfStock";
      } else if (stockAlertAttr === 'ON_STOCK' || optionClasses.includes('STOCK_ON_STOCK')) {
        availability = "https://schema.org/InStock";
      }
    } 
    else if (typeof window.epConfig !== 'undefined' && window.epConfig.currentProduct && window.epConfig.currentProduct.stockAlert) {
      const stockAlert = window.epConfig.currentProduct.stockAlert;
      if (stockAlert === 'OUT_STOCK') {
        availability = "https://schema.org/OutOfStock";
      }
    }

    // 6. Extract Aggregate Rating if present
    let aggregateRating = null;
    const ratingContainer = mainArea.querySelector('[itemprop="aggregateRating"]');
    if (ratingContainer) {
      const ratingEl = ratingContainer.querySelector('[itemprop="ratingValue"]');
      const countEl = ratingContainer.querySelector('[itemprop="reviewCount"]');
      const bestEl = ratingContainer.querySelector('[itemprop="bestRating"]');
      const worstEl = ratingContainer.querySelector('[itemprop="worstRating"]');

      const ratingValue = ratingEl?.getAttribute('content')?.trim() || ratingEl?.textContent?.trim();
      const reviewCount = countEl?.getAttribute('content')?.trim() || countEl?.textContent?.trim();
      const bestRating = bestEl?.getAttribute('content')?.trim() || '5';
      const worstRating = worstEl?.getAttribute('content')?.trim() || '1';

      if (ratingValue && reviewCount) {
        aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": ratingValue,
          "reviewCount": reviewCount,
          "bestRating": bestRating,
          "worstRating": worstRating
        };
      }
    }

    // 7. Extract Individual Reviews if present
    let reviews = [];
    const reviewElements = mainArea.querySelectorAll('[itemprop="review"]');
    reviewElements.forEach(revEl => {
      const ratingEl = revEl.querySelector('[itemprop="reviewRating"] [itemprop="ratingValue"]');
      const bestEl = revEl.querySelector('[itemprop="reviewRating"] [itemprop="bestRating"]');
      const worstEl = revEl.querySelector('[itemprop="reviewRating"] [itemprop="worstRating"]');
      const titleEl = revEl.querySelector('[itemprop="description"]');
      const authorEl = revEl.querySelector('[itemprop="author"]');
      const bodyEl = revEl.querySelector('[itemprop="reviewBody"]');

      // Parse date (e.g., 24.07.2024 -> 2024-07-24 for Google compliance)
      let datePublished = '';
      const containerText = revEl.textContent || '';
      const dateMatch = containerText.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
      if (dateMatch) {
        const day = dateMatch[1].padStart(2, '0');
        const month = dateMatch[2].padStart(2, '0');
        const year = dateMatch[3];
        datePublished = `${year}-${month}-${day}`;
      }

      const ratingValue = ratingEl?.getAttribute('content')?.trim() || ratingEl?.textContent?.trim();
      const bestRating = bestEl?.getAttribute('content')?.trim() || '5';
      const worstRating = worstEl?.getAttribute('content')?.trim() || '1';
      const reviewName = titleEl?.textContent?.trim() || '';
      const authorName = authorEl?.textContent?.trim() || '';
      const reviewBody = bodyEl?.textContent?.trim() || '';

      if (ratingValue && authorName) {
        const reviewObj = {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": authorName
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": ratingValue,
            "bestRating": bestRating,
            "worstRating": worstRating
          }
        };

        if (reviewName) {
          reviewObj.name = reviewName;
        }
        if (reviewBody) {
          reviewObj.reviewBody = reviewBody;
        }
        if (datePublished) {
          reviewObj.datePublished = datePublished;
        }

        reviews.push(reviewObj);
      }
    });

    // 8. Build Offer Object
    const offersObj = {
      "@type": "Offer",
      "url": url,
      "priceCurrency": currency,
      "price": price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": availability
    };

    if (oldPrice && !isNaN(parseFloat(oldPrice)) && oldPrice !== price) {
      offersObj.priceSpecification = {
        "@type": "UnitPriceSpecification",
        "priceType": "https://schema.org/StrikethroughPrice",
        "price": oldPrice,
        "priceCurrency": currency
      };
    }

    // 9. Build Product Schema
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

    if (aggregateRating) {
      productSchema.aggregateRating = aggregateRating;
    }

    if (reviews.length > 0) {
      productSchema.review = reviews;
    }

    // 10. Inject or update in <head>
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

  // Watch for dynamic updates
  const mainContent = document.querySelector('#main-content') || document.body;
  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(buildOrUpdateProductSchema, 300);
  });

  observer.observe(mainContent, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', huInitProductSchema);
} else {
  huInitProductSchema();
}
