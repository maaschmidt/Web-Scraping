import * as dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';

const API_KEY: string = process.env.API_KEY;

const waitFor = async (seconds: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(function () {
      resolve();
    }, 1000 * seconds);
  })
}

export const solveCaptcha = async (siteKey: string, pageURL: string, invisible: boolean = false) => {
  let url = `http://2captcha.com/in.php?key=${API_KEY}&method=hcaptcha&json=true&sitekey=${siteKey}&pageurl=${pageURL}&invisible=${invisible}`

  let response = await axios.get(url)

  try {
    if (response.data.status === 1) {
      const captchaID = response.data.request;
      let resResponse = {
        data: {
          status: undefined,
          request: undefined
        }
      };

      do {
        await waitFor(20)
        resResponse = await axios.get(`http://2captcha.com/res.php?key=${API_KEY}&action=get&id=${captchaID}&json=true`);
        if (resResponse.data.status === 1) {
          return resResponse.data.request
        }
      } while (resResponse.data.status != 1)

    } else {
      return response.data
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}
