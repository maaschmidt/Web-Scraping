import puppeteer from 'puppeteer-extra';
import { executablePath } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pdf from 'pdf-parse';
import rp from 'request-promise-native';

const pageURL = 'https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PF/Emitir';

const waitForTimeout = async (seconds: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(function () {
      resolve();
    }, seconds * 1000);
  });
};

export const checkPF = async (cpf: string) => {
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
    await waitForTimeout(3)

    await page.goto(pageURL);

    page.on('request', async (request) => {
      if (request.url().startsWith(`https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PF/Emitir/Emitir?Ni=${cpf}`)) {

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
            }
          }

        } catch (error) { }
      }
    });

    await page.waitForSelector('#NI', { visible: true, timeout: 5000 });

    await page.click('#NI');

    await page.keyboard.type(cpf);

    await page.click('#validar');

    await page.waitForSelector('.modalLoading', { hidden: false })

    await page.waitForSelector('.modalLoading', { hidden: true })

    if (await page.$eval('#mensagem', (el) => el.textContent === 'CPF inválido')) {
      // CPF INVÁLIDO
      response = `CPF INVÁLIDO`;
      return response;
    } else if (await page.$('#FrmSelecao > a:nth-child(6)')) {
      // NEGATIVO, CERTIDÃO JÁ EMITIDA
      await page.click('#FrmSelecao > a:nth-child(6)');
    }

    await page.waitForSelector('.avaliacao')

    if (await page.$('#rfb-main-container > div > a:nth-child(6)')) {
      // POSSIVELMENTE POSITIVO
      response = `POSSIVELMENTE POSITIVO`;
      return response;
    } else if (await page.$('#rfb-main-container > div > a')) {
      // CPF PENDENTE DE REGULARIZAÇÃO
      response = `PENDENTE DE REGULARIZAÇÃO`;
      return response;
    }
  } catch (error) { }
  finally {
    await browser.close();
    while (response === '') {
      checkPF(cpf);
    }
    return { cpf, response };
  }
}