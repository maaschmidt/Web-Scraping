import puppeteer from 'puppeteer-extra';
import { executablePath } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pdf from 'pdf-parse';
import rp from 'request-promise-native';

const pageURL = 'https://projudi.tjgo.jus.br/CertidaoNegativaPositivaPublicaPJ';

export const checkPJ = async (name: string, cnpj: string, type: string = 'civel') => {
  let response: string = '';

  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    defaultViewport: null,
    slowMo: 20
  })

  const page = await browser.newPage();

  try {

    await page.goto(pageURL);

    await page.setRequestInterception(true);

    page.on('request', async (request) => {

      if (request.url().startsWith(`https://projudi.tjgo.jus.br/CertidaoNegativaPositivaPublica`)) {

        const options = {
          method: request.method(),
          uri: request.url(),
          body: request.postData(),
          headers: request.headers(),
          encoding: 'binary',
        };

        const cookies = await page.cookies();
        options.headers.Cookie = cookies.map((ck) => ck.name + '=' + ck.value).join(';');

        try {
          const ret = await rp(options);

          const pdfText = await pdf(Buffer.from(ret, 'binary'));

          if (pdfText.text.match('NADA CONSTA')) {
            request.abort();
            response = 'NADA CONSTA';
          }

        } catch (error) {
          console.log('CATCH 1 => ', error.message)
        }
      }
    });

    await page.waitForSelector('#divEditar > fieldset:nth-child(1) > input[type=radio]:nth-child(4)', { visible: true });

    if(type.toLowerCase() === 'civel'){
      await page.click('#divEditar > fieldset:nth-child(1) > input[type=radio]:nth-child(4)');
    } else if(type.toLowerCase() === 'criminal'){
      await page.click('#divEditar > fieldset:nth-child(1) > input[type=radio]:nth-child(5)');
    }

    await page.click('#RazaoSocial');

    await page.keyboard.type(name);

    await page.click('#Cnpj');

    await page.keyboard.type(cnpj);

    await page.click('#divGuiaCriminalCivelGratuita > input[type=radio]:nth-child(12)');

    await page.click('input[name="imgSubmeter"]');

  } catch (error) {
    console.log('CATCH 2 => ', error.message);
  } finally {
    await browser.close();

    return response;
  }
}