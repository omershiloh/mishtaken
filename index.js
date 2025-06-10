const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/lotteries', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  try {
    const page = await browser.newPage();
    await page.goto('https://www.dira.moch.gov.il/ProjectsList', {
      waitUntil: 'networkidle2',
    });

    await page.waitForSelector('b.blue-label.col-md-1.count.ng-binding', {
      timeout: 10000
    });

    const count = await page.$eval(
      'b.blue-label.col-md-1.count.ng-binding',
      el => el.innerText.trim()
    );

    res.json({ openLotteries: parseInt(count, 10) });
  } catch (err) {
    console.error('Scraping error:', err);
    res.status(500).json({ error: 'Failed to retrieve lottery data' });
  } finally {
    await browser.close();
  }
});

app.get('/', (req, res) => {
  res.send('Mishtaken Scraper is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
