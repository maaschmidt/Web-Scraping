import puppeteer from "puppeteer-extra";
import { executablePath } from "puppeteer";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const initBrowser = async (url: string) => {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({ headless: false, executablePath: executablePath() })
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36',
  );

  await page.goto(url, { waitUntil: 'load', timeout: 60000 });

  let iframe = await page.$('#px-captcha')
  if (iframe) {
    await pxCaptcha(iframe, 5000, page);
  }

  return { page, browser };
}

const pxCaptcha = async (selector: any, time: number, page: any) => {
  await selector.evaluate((el) => el.style.display = 'flex');
  await selector.evaluate((el) => el.style.width = 20 + '%');
  await page.waitForTimeout(time / 2);

  while (await page.$('#px-captcha')) {
    await page.click('#px-captcha', { button: 'left' })
    await page.keyboard.press('Space', { delay: time })
    await page.waitForTimeout(time);
    time = + 2500;
  }
}

export const getUrl = async (baseURL: string) => {
  const { page, browser } = await initBrowser(baseURL);

  await page.waitForSelector('.CardVehicle__linkPhoto');
  const urls = await page.$$eval('.sc-hwwEjo.czIXqu', elements => {
    return elements.map(element => element.href);
  })

  await browser.close();

  const reducedArray = urls.reduce((acc, curr) => {
    if (acc.length) {
      const lastPushed = acc[acc.length - 1];
      if (lastPushed[0] !== curr) {
        acc.push([curr]);
      }
    } else {
      acc.push([curr]);
    }
    return acc;
  }, []);

  const urlsFormated = [];
  for (const element of reducedArray) {
    urlsFormated.push(element[0]);
  }

  return urlsFormated;
}

export const getCarInfos = async (baseURL: string) => {
  const { page, browser } = await initBrowser(baseURL);

  await page.waitForNetworkIdle();
  const name = await page.$eval('.VehicleDetails__header__title', el => el.textContent.replace('\n', '/s'));
  const value = await page.$eval('.Forms__vehicleSendProposal__container__price', el => el.textContent);
  const fipe = await page.$eval('.VehicleDetailsFipe__price.VehicleDetailsFipe__price--fipe', el => el.textContent.replace(/[a-zA-QS-Z]+/g, '').replace(/\s/g, '').replace('$', '$ '));
  const grossDetails = await page.$$eval('.VehicleDetails__list__item', elements => {
    return elements.map(element => element.innerText.replace('\n', ": "))
  });

  await browser.close();

  let details: any = {};
  let itens: any = [];
  grossDetails.map(detail => {
    if (detail) {
      let splited = detail.split(': ');
      if (splited[1]) {
        splited[0] = splited[0].normalize('NFD').replace(/\s/g, '').replace(/[\u0300-\u036f]/g, "").toLowerCase();
        details[splited[0]] = splited[1]
      } else if (splited[0] != 'undefined') {
        itens.push(splited[0])
      }
    }
  });
  if (itens) {
    details.itens = itens;
  }

  return ({ name, value, fipe, details });
}
