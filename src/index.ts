import rp from 'request-promise';
import $ from 'cheerio';
import { getPersonalInfo } from './getPersonalInfo';

const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

rp(url)
  .then(function (html: string) {
    const wikiUrls: any = [];
    for (let i = 0; i < 46; i++) {
      wikiUrls.push($('b > a', html)[i].attribs.href);
    }
    return Promise.all(
      wikiUrls.map(function (url: string) {
        return getPersonalInfo('https://en.wikipedia.org' + url);
      })
    );
  })
  .then(function (presidents: []) {
    console.log(presidents);
  })
  .catch(function (err: any) {
    console.log(err);
  });