import * as dotenv from 'dotenv'
dotenv.config()
import puppeteer from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import { executablePath } from 'puppeteer';

const API_KEY = process.env.API_KEY

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: API_KEY
    },
    visualFeedback: true
  })
)

// Puppeteer usage as normal (headless is "false" just for this demo)
puppeteer
  .launch({ headless: false, executablePath: executablePath() })
  .then(async browser => {

  const page = await browser.newPage()

  await page.goto('https://www.google.com/recaptcha/api2/demo')

  // Even this `Puppeteer.Page` extension is recognized and fully type safe 🎉
  await page.solveRecaptchas()

  await Promise.all([
    page.waitForNavigation(),
    page.click(`#recaptcha-demo-submit`)
  ])

  await page.screenshot({ path: 'response.png', fullPage: true })
  
  await browser.close()
})