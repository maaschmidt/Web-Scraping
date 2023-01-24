import puppeteer from 'puppeteer-extra';
import { executablePath } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pdf from 'pdf-parse';
import rp from 'request-promise-native';

const pageURL = 'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir';

const waitForTimeout = async (seconds: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(function () {
      resolve();
    }, seconds * 1000);
  });
};

export const checkPJ = async (cnpj: string) => {
  let response: string = '';

  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
    defaultViewport: null,
    slowMo: 100
  })

  const page = await browser.newPage();

  try {
    await waitForTimeout(3);

    await page.goto(pageURL);

    page.on('request', async (request) => {
      if (request.url().startsWith(`https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir/Emitir?Ni=${cnpj}`)) {

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

          if (ret.startsWith('%PDF')) {
            const pdfText = await pdf(Buffer.from(ret, 'binary'));

            if (pdfText.text.match('CERTIDÃO NEGATIVA DE DÉBITOS RELATIVOS AOS TRIBUTOS FEDERAIS E À DÍVIDA')) {
              response = `CERTIDÃO NEGATIVA`;
              return response;
            } else if (pdfText.text.match('CERTIDÃO POSITIVA COM EFEITOS DE NEGATIVA DE DÉBITOS RELATIVOS AOS TRIBUTOS')) {
              response = `POSITIVA COM EFEITOS DE NEGATIVA`;
              return response;
            }
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    });

    await page.waitForSelector('#NI', { visible: true, timeout: 5000 });

    await page.click('#NI');

    await page.keyboard.type(cnpj);

    await page.click('#validar');

    await page.waitForSelector('.modalLoading', { hidden: false })

    await page.waitForSelector('.modalLoading', { hidden: true })

    if (await page.$('#FrmSelecao > a:nth-child(6)')) {
      // NEGATIVO, CERTIDÃO JÁ EMITIDA
      await page.click('#FrmSelecao > a:nth-child(6)');
    }

    await page.waitForSelector('.avaliacao')

    if (await page.$('#rfb-main-container > div > a:nth-child(6)')) {
      // POSSIVELMENTE POSITIVO
      response = `POSSIVELMENTE POSITIVO`;
      return response;
    } else if (await page.$eval('.parametros.group-inline', (el) => el.textContent.match('A certidão deve ser emitida para o CNPJ da matriz'))) {
      // A certidão deve ser emitida para o CNPJ da matriz
      response = `A certidão deve ser emitida para o CNPJ da matriz`;
      return response;
    } else if (await page.$eval('.parametros.group-inline', (el) => el.textContent.match('O número informado não consta do cadastro CNPJ.'))) {
      // CNPJ INVÁLIDO
      response = `CNPJ INVÁLIDO`;
      return response;
    }

  } catch (error) {
    console.log(error.message)
  }
  finally {
    await browser.close();
    while (response === '') {
      checkPJ(cnpj);
    }
    return { cnpj, response };
  }
}
