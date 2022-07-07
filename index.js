require('dotenv').config();

let { argv } = require('yargs/yargs')(process.argv.slice(2)).check(argv => {
  if (!argv.names) {
    throw new Error('missing --names and names list filepath');
  }
  return true;
});

const getNames = async () => {
  const fs = require('fs/promises');
  const data = await fs.readFile(argv.names, 'utf-8');
  return data.split('\n');
};

const loadPage = async () => {
  // Initialise puppeteer
  console.log('Loading browser...');
  const puppeteer = require('puppeteer');
  const { PendingXHR } = require('pending-xhr-puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const pendingXHR = new PendingXHR(page);
  console.log('Browser loaded.');

  // Loading signup page
  console.log('Loading page %s...', process.env.BG_WEBSITE);
  await page.authenticate({
    username: process.env.BG_USER,
    password: process.env.BG_PASS
  });
  await page.goto(process.env.BG_WEBSITE);
  await page.waitForNetworkIdle();
  await pendingXHR.waitForAllXhrFinished();
  console.log('Page loaded.');

  return { browser, page, pendingXHR };
};

/**
 * @param {Browser} browser
 */
const cleanup = async browser => {
  await browser.close();
  console.log('Registering finished.');
};

/**
 * @param {string[]} names
 * @param {Page} page
 * @param {PendingXHR} pendingXHR
 */
const registerNames = async (names, page, pendingXHR) => {
  // Get input fields and register button
  const personInput = await page.$('#person');
  const mobileInput = await page.$('#mobile');
  const registerButton = await page.$('[name=Register]');

  // Get names and register them
  for (const name of names) {
    console.log('Registering %s...', name);
    await personInput.click({ clickCount: 3 });
    await personInput.type(name);
    await mobileInput.click({ clickCount: 3 });
    await mobileInput.type(process.env.BG_MOBILE);
    await registerButton.click();
    await pendingXHR.waitForAllXhrFinished();
    console.log('%s registered.', name);
  }
};

const run = async () => {
  if (process.env.NODE_ENV !== 'test') {
    const schedule = require('node-schedule');
    const names = await getNames();
    let browser;
    let page;
    let pendingXHR;

    const jobLoad = schedule.scheduleJob('59 9 * * 3', async () => {
      console.log('Browser');
      const loaded = await loadPage();
      browser = loaded.browser;
      page = loaded.page;
      pendingXHR = loaded.pendingXHR;
      jobLoad.cancel();
    });

    const jobRegister = schedule.scheduleJob('1 10 * * 3', async function () {
      await registerNames(names, page, pendingXHR);
      await cleanup(browser);
      jobRegister.cancel();
    });

    console.log('Browser will run at %s', jobLoad.nextInvocation().toString());
    console.log(
      'Registration will run at %s',
      jobRegister.nextInvocation().toString()
    );
    console.log('Names list:');
    console.log(...names);
  }
};

run();

module.exports = { getNames };
