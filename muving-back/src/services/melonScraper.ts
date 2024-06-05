import puppeteer from 'puppeteer';
import Music from '../types/music';

const melonScraper = async (url: string): Promise<Music[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  const playList: Music[] = [];
  let idCounter = 1;

  // Function to scrape data from the current page
  const scrapePage = async (pageNumber: number): Promise<void> => {
    await page.waitForSelector('tbody tr');

    const rows = await page.$$('tbody tr');
    console.log(`Scraping ${rows.length} rows on page ${pageNumber}`);

    for (const row of rows) {
      const title = await row.$eval(
        'td:nth-child(3) a.fc_gray',
        (el) => el.textContent?.trim() || ''
      );
      const artist = await row.$eval(
        'td:nth-child(4) a.fc_mgray',
        (el) => el.textContent?.trim() || ''
      );
      const album = await row.$eval(
        'td:nth-child(5) a.fc_mgray',
        (el) => el.textContent?.trim() || ''
      );

      playList.push({
        id: idCounter++,
        title,
        artist,
        album
      });
    }
  };

  // Function to check if there is a next page and navigate to it
  const navigateToNextPage = async (currentPage: number): Promise<boolean> => {
    const nextPageNumber = currentPage * 50 + 1;
    const nextPageSelector = `a[href="javascript:pageObj.sendPage('${nextPageNumber}');"]`;

    const nextButton = await page.$(nextPageSelector);
    if (nextButton) {
      console.log(`Navigating to page ${nextPageNumber / 50 + 1}...`);
      await Promise.all([
        nextButton.click(),
        page.waitForNavigation({ waitUntil: 'networkidle2' })
      ]);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds to ensure page loads
      return true;
    }
    return false;
  };

  // Loop to scrape all pages
  let currentPage: number = 1;
  let hasNextPage: boolean;

  do {
    await scrapePage(currentPage);
    hasNextPage = await navigateToNextPage(currentPage);
    currentPage++;
  } while (hasNextPage);

  await browser.close();

  return playList;
};

export default melonScraper;
