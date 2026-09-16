<!-- Non-critical S scripts -->
window.addEventListener('load', function() {huPopupBonus();huRibbon();});

<!-- Smartsupp Start -->
var _smartsupp = _smartsupp || {};
_smartsupp.key = 'e5cd23dc9b20b5bfee567d1a8d03f0a372135f4e';
window.smartsupp||(function(d) {
	var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
	s=d.getElementsByTagName('script')[0];c=d.createElement('script');
	c.type='text/javascript';c.charset='utf-8';c.async=true;
	c.src='//www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
})(document);
<!-- Smartsupp End -->
	
/*HU PopUp Script Bonus Start*/
function huPopupBonus(){
const hupopupHTML = `<div class="hupopparent" id="hupopparent">
   <div class="hupopcontainer" id="hupopcontainer">
  <div class="hucookiesleft" id="hucookiesleft"><img src="https://www.hockeyunlimited.fi/WebRoot/vilkasfi01/Shops/2014061601/MediaGallery/icehockey-AVIF.avif" alt="icehockey">  </div>
  <div class="hucookiesContent" id="hucookiesPopup">
    <button class="hupopclose" id="hupopclose">✖</button>
    <div class="hupop-inner">
    <img class="hupopimg" src="https://www.hockeyunlimited.fi//WebRoot/vilkasfi01/Shops/2014061601/MediaGallery/Logo.png" alt="Hockey Unlimited logo" />
    <br>
    <div class="hupoptextblock">
    <p class="hupoptext" id="hupoptext"></p>
    <br>
    <a class="hupoplink" id="hupoplink" target="_blank"></a>
    <br>
    <br>
    <button class="hupopaccept" id="hupopaccept" onclick="window.location.href='https://www.hockeyunlimited.fi/epages/hockeyunlimited.sf/fi_FI/?ObjectPath=/Shops/2014061601&ViewAction=ViewRegistration';"></button>
  </div>
</div>
</div>
</div>
</div>`;

setTimeout(function() {

  if (!document.cookie.split('; ').find(row => row.startsWith('popupBonusShown='))) {
  document.body.insertAdjacentHTML('beforeend', hupopupHTML);
  document.cookie = "popupBonusShown=true; max-age=604800; path=/";
    
  const lang = document.documentElement.lang || 'fi';
  const hudialog = document.getElementById('hupopparent');
  const hucloseButton = document.getElementById('hupopclose');
  const textEl = document.getElementById('hupoptext');
  const linkEl = document.getElementById('hupoplink');
  const buttonEl = document.getElementById('hupopaccept');

  let translations = {
        fi: {
          text: `<span class="hutext-top">Liity kanta-asiakasklubiimme ja ansaitset</span>
          <span class="hubonuspisteet">5€</span>
          <span class="hutext-top">bonuspisteinä tilillesi!</span>
          <span class="hutext-bottom">5€ = 500 pistettä</span>`,
          link: "lisää kanta-asiakasklubistamme",
          linkUrl: "https://www.hockeyunlimited.fi/Kanta-asiakasklubi", 
          button: "Liity ilmaiseksi",
          buttonUrl: "https://www.hockeyunlimited.fi/epages/hockeyunlimited.sf/fi_FI/?ObjectPath=/Shops/2014061601&ViewAction=ViewRegistration"
        },
        en: {
          text: `<span class="hutext-top">Join our loyalty club and earn</span>
          <span class="hubonuspisteet">5€</span>
          <span class="hutext-top">in bonus points to your account!</span>
          <span class="hutext-bottom">5€ = 500 points</span>`,
          link: "more about our loyalty club",
          linkUrl: "https://www.hockeyunlimited.fi/Loyalty-Club", 
          button: "Join for free",
          buttonUrl: "https://www.hockeyunlimited.fi/epages/hockeyunlimited.sf/en_GB/?ViewObjectPath=%2FShops%2F2014061601&ViewAction=ViewRegistration"
        },
        ru: {
          text: `<span class="hutext-ru">Присоединяйтесь к нашей программе лояльности и получите</span>
          <span class="hubonuspisteet">5€</span>
          <span class="hutext-ru">в виде бонусных баллов на свой счёт!</span>
          <span class="hutext-bottom">5€ = 500 баллов</span>`,
          link: "подробнее о нашей программе лояльности",
          linkUrl: "https://www.hockeyunlimited.fi/Programma-Loyalnosti", 
          button: "Зарегистрируйтесь",
          buttonUrl: "https://www.hockeyunlimited.fi/epages/hockeyunlimited.sf/ru_RU/?ViewObjectPath=%2FShops%2F2014061601&ViewAction=ViewRegistration"
        }
      }

  const t = translations[lang] || translations.fi;
  textEl.innerHTML = t.text;
  linkEl.textContent = t.link;
  linkEl.href = t.linkUrl;
  buttonEl.textContent = t.button;

  buttonEl.onclick = function() {
        window.location.href = t.buttonUrl;
      };
  
  
  hucloseButton.addEventListener('click', hupopclose);

  function hupopopen() {
    hudialog.style.display = "flex";
    setTimeout(hupopclose, 30000);

  }

  function hupopclose() {
    hudialog.style.display = "none";
  };
  hupopopen()
  }
  }, 5000);
  
};
/*HU PopUp Script Bonus End*/

/*HU Bonus Ribbon Start*/

function huRibbon(){
  let navbar = document.querySelector(".HorizontalNavBar");
  if (navbar) {
    const lang = document.documentElement.lang || 'fi';
    let translations = {
        fi: {
          text: '<a class="huribbonlink" href="https://www.hockeyunlimited.fi/Kanta-asiakasklubi" target="_blank">Liity kanta-asiakasklubiimme ja ansaitse 5€:n etu bonuspisteinä!</a>',
        },
        en: {
          text: '<a class="huribbonlink" href="https://www.hockeyunlimited.fi/Loyalty-Club" target="_blank">Join our loyalty club and earn 5€ in bonus points to your account!</a>',
        },
        ru: {
          text: '<a class="huribbonlink" href="https://www.hockeyunlimited.fi/Programma-Loyalnosti" target="_blank">Присоединяйтесь к нашей программе лояльности и получите 5€ в виде бонусных баллов!</a>',
        }
      };
    const t = translations[lang] || translations.fi;
    let ribbon = document.createElement("div");
    ribbon.classList.add("huribbon");
    ribbon.innerHTML = t.text;
    navbar.insertAdjacentElement("afterend", ribbon);
  }
}
/*HU Bonus Ribbon End*/
