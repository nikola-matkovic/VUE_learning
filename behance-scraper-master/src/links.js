import puppeteer from 'puppeteer'
import * as dotenv from 'dotenv'
import chalk from 'chalk'
import { promises as fs } from 'fs'
import path from 'path'

dotenv.config()

const countryCode = process.argv.slice(2)
if (countryCode.length === 0) {
  console.log(chalk.redBright('Please enter country code!\n'))
  process.exit()
}

const startUrl = 'https://www.behance.net/search/users?country=' + process.argv.slice(2)
const browser = await puppeteer.launch({ headless: false })
const page = await browser.newPage()

// Disable all images
await page.setRequestInterception(true)
page.on('request', (req) => {
  if (req.resourceType() === 'image') {
    req.abort()
  } else {
    req.continue()
  }
})

await page.setViewport({ width: 1280, height: 800 })
await page.goto(startUrl)
await page.waitForNavigation({ waitUntil: 'networkidle2' })

// Login with Adobe account
// Step 1 - Go to Signin page
await page.waitForSelector('button.js-adobeid-signin')
await page.evaluate('document.querySelector("button.js-adobeid-signin").click()')
await page.waitForNavigation({ waitUntil: 'networkidle2' })
// Step 2 - Enter email
await page.waitForSelector('input[name=username]')
await new Promise((resolve) => setTimeout(resolve, 1000))
await page.type('input[name=username]', process.env.BEHANCE_EMAIL)
// Step 3 - Click on Continue button
await page.waitForSelector('button[data-id=EmailPage-ContinueButton]')
await page.evaluate('document.querySelector("button[data-id=EmailPage-ContinueButton]").click()')
// Step 4 - Enter password
await page.waitForSelector('input[name=password]')
await page.type('input[name=username]', process.env.BEHANCE_PASSWORD)
// Step 5 - Finish login
await page.waitForSelector('button[data-id=PasswordPage-ContinueButton]')
await page.evaluate('document.querySelector("button[data-id=PasswordPage-ContinueButton]").click()')

await page.waitForSelector('li.ContentGrid-gridItem-VXS')
const items = await scrapeItems(page, extractItems, 20000)

await fs.writeFile(path.join('storage', 'items-' + countryCode + '.json'), JSON.stringify(items), { encoding: 'utf8' })

await browser.close()

async function scrapeItems(page, extractItems, itemCount, scrollDelay = 300) {
  let items = []
  let count = 1
  try {
    while (items.length < itemCount) {
      const newItems = await page.evaluate(extractItems)
      for (const newItem of newItems) {
        console.log(chalk.yellowBright(count) + ' :: ' + chalk.greenBright(newItem))
        count++
      }
      items = items.concat(newItems)
      const previousHeight = await page.evaluate('document.body.scrollHeight')
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`)
      await page.waitForTimeout(scrollDelay)
      await page.evaluate(removeExtractedItems)
    }
  } catch (e) {}

  return items.slice(0, itemCount)
}

function extractItems() {
  const extractedElements = document.querySelectorAll('a.UserSummary-ownerLink-Al7')
  const items = []
  for (let element of extractedElements) {
    items.push(element.href.split('?')[0])
    element.classList.add('quaaant-remove')
  }
  return items
}

function removeExtractedItems() {
  const extractedElements = document.querySelectorAll('.quaaant-remove')
  for (let element of extractedElements) {
    element.closest('li').parentNode.removeChild(element.closest('li'))
  }
}
