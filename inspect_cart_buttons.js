const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.demoblaze.com/cart.html', { waitUntil: 'domcontentloaded' });
  const buttons = await page.$$('.btn-success');
  console.log('.btn-success count', buttons.length);
  for (let i = 0; i < buttons.length; i++) {
    const txt = await buttons[i].innerText();
    const html = await buttons[i].evaluate(el => el.outerHTML);
    console.log(i, JSON.stringify(txt), html.slice(0, 250));
  }
  await browser.close();
})();
