import rp from 'request-promise';
import $ from 'cheerio';
import { getPersonalInfo } from './getPersonalInfo';

const baseURL = 'https://pt.wikipedia.org'
const generalURL = `${baseURL}/wiki/Lista_de_presidentes_do_Brasil`;

rp(generalURL)
  .then(function (html: string) {
    const eachOneUrl: any = [];
    for (let i = 0; i < 5000; i++){
      const url = $('#mw-content-text > div.mw-parser-output > table.wikitable > tbody > tr > td > b > a', html)[i]?.attribs.href;
      if (url) {
        eachOneUrl.push(url);
      } else {
        break;
      }
    }
    return Promise.all(
      eachOneUrl.map(function (url: string) {
        return getPersonalInfo(`${baseURL}${url}`);
      })
    );
  })
  .then(function (presidents= []) {
    console.log(presidents)
  })
  .catch(function (err: any){
    console.log(err)
  })