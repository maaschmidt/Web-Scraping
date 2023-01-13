import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';

import { solveCaptcha } from '../solve-hcaptcha';

const siteKey = '4a65992d-58fc-4812-8b87-789f7e7c4c4b';
const pageURL = 'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PF/Emitir';
const invisible = true;

const main = async (cpf: string) => {

  puppeteer
    .use(StealthPlugin())
    .launch({ headless: false, executablePath: executablePath() })
    .then(async browser => {

      try {
        const page = await browser.newPage();
        await page.setViewport({
          height: 1080,
          width: 1920
        })
        
        await page.goto(pageURL);

        await page.waitForSelector('#NI', { visible: true });

        await page.click('#NI', { delay: 500 });

        await page.keyboard.type(cpf, { delay: 200 });

        // const captchaToken = await solveCaptcha(siteKey, pageURL, invisible)

        // await page.type('textarea[name=h-captcha-response]', captchaToken);

        await page.click('#validar');

        try {
          await page.waitForNavigation({ waitUntil: 'load' })

          const isNewCertificate = await page.$eval('#FrmSelecao > a:nth-child(6)', (element) => element.textContent);

          if (isNewCertificate) {
            await page.click('#FrmSelecao > a:nth-child(6)');
          }
        } catch (error) {
          console.log(error.message);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        await browser.close();
      }

    })
}

main('CPF')
