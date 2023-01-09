import { PlaywrightCrawler, playwrightUtils, Dataset } from 'crawlee'
import _extractEmail from 'extract-email-address'
import { readFileSync } from 'fs'

const extractEmail = _extractEmail.default
const filename = process.argv[2];
const storeName = filename.replace(/^.*[\\\/]/, '').split('.')[0];
const dataset = await Dataset.open( storeName );

const crawler = new PlaywrightCrawler({
  launchContext: {
    launchOptions: {
      // headless: false,
    },
  },

  preNavigationHooks: [
    async (crawlingContext) => {
      // Disable all images
      const { page } = crawlingContext
      await playwrightUtils.blockRequests(page)
    },
  ],

  // autoscaledPoolOptions: {
  //   maxConcurrency: 1,
  //   minConcurrency: 1
  // },

  maxConcurrency: 2,
  maxRequestsPerMinute: 10,

  requestHandler: async ({ page, request, browserController }) => {
    console.log(`Processing: ${request.url}`)

    const cookie = [{
      name: 'OptanonAlertBoxClosed',
      value: '2022-10-24T22:07:31.910Z',
      domain: 'www.behance.net',
      path: '/',
    }]

    browserController.setCookies(page, cookie)
    await page.waitForSelector('h1')

    // Get user stats data
    const projectViewsHtml = page.locator('tr.UserInfo-statRow-wH9', { hasText: 'Project Views' })
    const appreciationsHtml = page.locator('tr.UserInfo-statRow-wH9', { hasText: 'Appreciations' })
    const followersHtml = page.locator('tr.UserInfo-statRow-wH9', { hasText: 'Followers' })
    const followingHtml = page.locator('tr.UserInfo-statRow-wH9', { hasText: 'Following' })
    const projectViews = await getSelectorText(projectViewsHtml, 'a')
    const appreciations = await getSelectorText(appreciationsHtml, 'a')
    const followers = await getSelectorText(followersHtml, 'a')
    const following = await getSelectorText(followingHtml, 'a')

    // Get teams data
    const teamsHtml = page.locator('.UserInfo-teamRowBorder-Tyd')
    const countTeams = await teamsHtml.count()
    let teams = []
    for (let i = 0; i < countTeams; ++i) {
      const teamLocation = await getSelectorText(teamsHtml.nth(i), 'a.ProfileInfoRow-locationLink-AOC')
      teams.push({
        teamName: await getSelectorText(teamsHtml.nth(i), 'a.ProfileInfoRow-name-L58'),
        teamUrl: await getSelectorAttribute(teamsHtml.nth(i), 'a.ProfileInfoRow-name-L58', 'href'),
        teamCountry: teamLocation.includes(', ') ? teamLocation.split(', ')[1] : teamLocation,
        teamCity: teamLocation.includes(', ') ? teamLocation.split(', ')[0] : '',
      })
    }

    // Get custom sidebar boxes data
    const contentHtml = page.locator('.UserInfo-bio-OZA')
    const countContent = await contentHtml.count()
    let content = []
    for (let i = 0; i < countContent; ++i) {
      if ((await contentHtml.nth(i).locator('div.ReadMore-content-F2D').count()) > 0) {
        await contentHtml.nth(i).locator('a.ReadMore-readMoreButton-o67').click()
        content.push(await contentHtml.nth(i).locator('div.ReadMore-content-F2D').textContent())
      } else {
        content.push(await contentHtml.nth(i).locator('span').textContent())
      }
    }

    // Get projects
    const projectsHtml = page.locator('.ProjectCoverNeue-root-B1h')
    const countProjects = await projectsHtml.count()
    let projects = []
    for (let i = 0; i < countProjects; ++i) {
      projects.push({
        projectTitle: await getSelectorText(projectsHtml.nth(i), 'a.Title-title-lpJ'),
        projectUrl: await getSelectorAttribute(projectsHtml.nth(i), 'a.Title-title-lpJ', 'href'),
        projectLikes: (await getSelectorAttribute(projectsHtml.nth(i), 'div.Stats-stats-Q1s > span >> nth=0', 'title')).replace(',', ''),
        projectViews: (await getSelectorAttribute(projectsHtml.nth(i), 'div.Stats-stats-Q1s > span >> nth=1', 'title')).replace(',', ''),
      })
    }

    // Get tools
    const toolsHtml = page.locator('.ProjectTools-pillShapedTool-uYx')
    const countTools = await toolsHtml.count()
    let tools = []
    for (let i = 0; i < countTools; ++i) {
      tools.push(await getSelectorAttribute(toolsHtml.nth(i), 'a > img', 'alt'))
    }

    // Extract emails from sidebar boxes data
    let emails = []
    for (const text of content) {
      extractEmail(text).forEach((item) => emails.push(item.email))
    }

    // Get resume url if exists
    const resumeUrl = (await page.locator('a', { hasText: 'View Full Resume' }).count()) > 0 ?
      await page.locator('a', { hasText: 'View Full Resume' }).getAttribute('href') : ''

    const location = await getSelectorText(page, 'span.e2e-Profile-location')
    let memberSince = await getSelectorText(page, 'p.UserInfo-memberSince-Kbs')
    memberSince = new Date(memberSince.split(':')[1])
    memberSince.setDate(memberSince.getDate() + 1)

    const results = {
      url: request.url,
      username: request.url.split('/').slice(-1)[0],
      user: await page.locator('h1').textContent(),
      occupation: await getSelectorText(page, 'p.e2e-Profile-occupation'),
      company: await getSelectorText(page, 'p.e2e-Profile-company'),
      web: await getSelectorAttribute(page, '.ProfileCard-lineText-Q4b > a.ProfileCard-anchor-q0M', 'href'),
      country: location.includes(', ') ? location.split(', ')[1] : location,
      city: location.includes(', ') ? location.split(', ')[0] : '',
      projectViews: projectViews.replace(',', ''),
      appreciations: appreciations.replace(',', ''),
      followers: followers.replace(',', ''),
      following: following.replace(',', ''),
      tools: tools,
      twitter: await getSelectorAttribute(page, 'li a[href*="twitter.com"]', 'href'),
      facebook: await getSelectorAttribute(page, 'li a[href*="facebook.com"]', 'href'),
      instagram: await getSelectorAttribute(page, 'li a[href*="instagram.com"]', 'href'),
      dribbble: await getSelectorAttribute(page, 'li a[href*="dribbble.com"]', 'href'),
      linkedin: await getSelectorAttribute(page, 'li a[href*="linkedin.com"]', 'href'),
      youtube: await getSelectorAttribute(page, 'li a[href*="youtube.com"]', 'href'),
      vimeo: await getSelectorAttribute(page, 'li a[href*="vimeo.com"]', 'href'),
      pinterest: await getSelectorAttribute(page, 'li a[href*="pinterest.com"]', 'href'),
      tumblr: await getSelectorAttribute(page, 'li a[href*="tumblr.com"]', 'href'),
      flickr: await getSelectorAttribute(page, 'li a[href*="flickr.com"]', 'href'),
      society6: await getSelectorAttribute(page, 'li a[href*="society6.com"]', 'href'),
      medium: await getSelectorAttribute(page, 'li a[href*="medium.com"]', 'href'),
      etsy: await getSelectorAttribute(page, 'li a[href*="etsy.com"]', 'href'),
      teams: teams,
      content: content,
      emails: emails,
      resumeUrl: resumeUrl,
      memberSince: memberSince,
      projects: projects,
    }

    // If email is still missing, open full resume
    if (results.emails.length === 0) {
      if ((await page.locator('a', { hasText: 'View Full Resume' }).count()) > 0) {
        await page.locator('a', { hasText: 'View Full Resume' }).click()
        const email = await getSelectorText(page, 'a[href*="mailto:"]')
        results.emails = email ? [email] : []
      }
    }

    await dataset.pushData(results)

  },
})


try{

  let data = readFileSync(filename, "utf8");

  data = JSON.parse(data);

  if(data){

    let dataInDataset = await dataset.getData()

    data.splice(0, dataInDataset.count);

    let promise = crawler.run(data)

    await promise;

  }
  else {
    
    console.error("Failed to parse JSON data! Invalid JSON.")

  }

}
catch( e ){

  console.error(e)

}


async function getSelectorText(page, selector) {
  return (await page.locator(selector).count()) > 0 ? await page.locator(selector).textContent() : ''
}

async function getSelectorAttribute(page, selector, attribute) {
  return (await page.locator(selector).count()) > 0 ? await page.locator(selector).getAttribute(attribute) : ''
}
