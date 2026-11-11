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

      // Google recommends only position and URL (plus optional name) for category ItemLists
      itemListElements.push({
        "@type": "ListItem",
        "position": index + 1,
        "url": fullUrl,
        "name": productName
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
