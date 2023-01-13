import rp from 'request-promise';
import $ from 'cheerio';

export const getPersonalInfo = async function (url: string) {
  try {
    const html = await rp(url);
    return {
      name: ($('.firstHeading', html).text()),
      birth: ($('[class="bday"]', html).text()).split("-").reverse().join("/")
    };
  } catch (err) { }
}