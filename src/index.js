import * as puppeteer from 'puppeteer';

const main = async (cpf) => {

  // Launch the browser
  const browser = await puppeteer.launch({
    headless: true
  });

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('https://www.situacao-cadastral.com/');

  // Query for an element handle.
  await page.waitForSelector('input[name=doc]');

  // Type cpf into the input
  await page.type('input[name="doc"]', cpf, { delay: 192 });

  // Click on search or press enter
  // await page.click('input[id=consultar]'); // Just an example.
  await page.keyboard.press('Enter')

  // Await for loading page
  await page.waitForSelector('#corpo > tbody > tr:nth-child(2) > td > span');

  let errorMessage = await page.$("#mensagem");

  while (errorMessage != null) {
    await page.reload();
    errorMessage = await page.$("#mensagem").innerHTML;
    console.log(errorMessage)

    let reg = await page.$(".vrd").innerHTML;

    // Get text
    if (reg) {
      console.log(reg.slice(10, 30))
    } else {
      let inex = await page.$(".vrm")

      if (inex) {
        console.log(reg.slice(10, 30))
      } else {
        let sus = await page.$(".amr")

        if (sus) {
          console.log(sus.slice(10, 30))
        }
      }
    }

    // Screenshot of the result
    await page.screenshot({ path: `cpf-${cpf}.png` })

    // Close browser.
    await browser.close();
  }
}

main('< CPF >')
