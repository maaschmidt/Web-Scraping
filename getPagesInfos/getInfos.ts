import puppeteer from "puppeteer-extra";
import { executablePath } from "puppeteer";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const initBrowser = async (url: string) => {
  puppeteer.use(StealthPlugin())
  const browser = await puppeteer.launch({ headless: false, executablePath: executablePath() })
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  return { page, browser };
}

export const getUrl = async (baseURL: string) => {
  const { page, browser } = await initBrowser(baseURL);

  const urls = await page.$$eval('.sc-eKZiaR.YfujD', elements => {
    return elements.map(element => element.href);
  })

  await browser.close();

  return urls
}

export const getHomeInfo = async (baseURL: string) => {
  const { page, browser } = await initBrowser(baseURL);

  const title = await page.$eval('.ad__sc-45jt43-0.fAoUhe.sc-cooIXK.kMRyJF', el => el.textContent);
  const value = await page.$eval('.sc-iIHSe.ad__sc-12l420o-0.gKlMXV', el => el.textContent);
  const code = await page.$eval('.ad__sc-16iz3i7-0.bTSFxO.sc-ifAKCX.fizSrB', el => el.textContent.replace(/\D+/g, ''));
  const grossDetails = await page.$$eval('.sc-hmzhuo.ad__sc-1f2ug0x-3.sSzeX.sc-jTzLTM.iwtnNi', elements => {
    return elements.map(element => element.innerText.replace('\n', '| '));
  });
  grossDetails.push(`url| ${baseURL}`);

  await browser.close();

  let details: any = {};
  grossDetails.map(detail => {
    let splited = detail.split('| ');
    splited[0] = splited[0].normalize('NFD').replace(/\s/g, '').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    details[splited[0]] = splited[1]
  });

  return { title, value, code, details };
}