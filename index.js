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

const registerNames = async () => {
  // Initialise puppeteer
  console.log('Loading browser...');
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('Browser loaded');

  // Loading signup page
  console.log('Loading page', process.env.BG_WEBSITE);
  await page.authenticate({
    username: process.env.BG_USER,
    password: process.env.BG_PASS
  });
  await page.goto(process.env.BG_WEBSITE);
  await page.waitForNetworkIdle();
  console.log('Page loaded');

  // Get input fields and register button
  const personInput = await page.$('#person');
  const mobileInput = await page.$('#mobile');
  const registerButton = await page.$('[name=Register]');
  // const unregisterButton = await page.$('[name=Unregister]');

  const names = await getNames();

  for (const name of names) {
    console.log('Inputting name:', name);
    await personInput.click({ clickCount: 3 });
    await personInput.type(name);
    await mobileInput.type(process.env.BG_MOBILE);
    await registerButton.click();
    console.log('Click registration button');
    await page.waitForNetworkIdle();
    console.log('Network idling finished');
  }

  const acceptedNames = await page.$$eval(
    'td.w2ui-grid-data[col="1"] div',
    divs => {
      return divs.map(div => div.textContent);
    }
  );

  const waitingNames = await page.$$eval(
    'td.w2ui-grid-data[col="3"] div',
    divs => {
      return divs.map(div => div.textContent);
    }
  );
  console.log(acceptedNames, waitingNames);

  await browser.close();
};

if (process.env.NODE_ENV !== 'test') {
  registerNames();
}

module.exports = { getNames };
