function huInitCategorySchema() {
  // Avoid duplicate injection
  if (document.getElementById('hu-category-schema')) return;
  // 1. Guard: Exit if this is a single product page or homepage carousel
  if (document.querySelector('.ProductDetails')) return;

  // 2. Target the product cards inside the Vilkas category grid
  // Note: Adjust '.ProductListImageBox' if your product cards use a different outer wrapper
  const productCards = document.querySelectorAll('.ProductListImageBox');
  if (!productCards.length) return;

  const itemListElements = [];

  productCards.forEach((card, index) => {
    // Extract the product link (matches your CSS selector: h3.TopPaddingWide > a)
    const linkEl = card.querySelector('h3.TopPaddingWide > a') || card.querySelector('a[href]');
    if (!linkEl) return;

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

  // Inject into <head>
  const script = document.createElement('script');
  script.id = 'hu-category-schema';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(categorySchema);
  document.head.appendChild(script);
}

// Run once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', huInitCategorySchema);
} else {
  huInitCategorySchema();
}
