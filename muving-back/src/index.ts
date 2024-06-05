import puppeteer from 'puppeteer';
import fs from 'fs';

interface Song {
  title: string;
  artist: string;
  album: string;
}

const melonList = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url =
    'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm?plylstSeq=501620449';
  await page.goto(url);

  const playList: Song[] = [];

  // Function to scrape data from the current page
  const scrapePage = async (): Promise<void> => {
    await page.waitForSelector('td.t_left');
    const elements = await page.$$('td.t_left');

    for (let i = 0; i < elements.length; i += 4) {
      const titleAnchorHandles = await elements[i].$$('a');
      const artistAnchorHandles = await elements[i + 1].$$('a');
      const albumAnchorHandles = await elements[i + 2].$$('a');

      const title = await page.evaluate(
        (el: HTMLAnchorElement) => el.innerText,
        titleAnchorHandles[titleAnchorHandles.length - 1]
      );
      const artist = await page.evaluate(
        (el: HTMLAnchorElement) => el.innerText,
        artistAnchorHandles[artistAnchorHandles.length - 1]
      );
      const album = await page.evaluate(
        (el: HTMLAnchorElement) => el.innerText,
        albumAnchorHandles[albumAnchorHandles.length - 1]
      );

      playList.push({
        title,
        artist,
        album
      });
    }
  };

  // Function to check if there is a next page and navigate to it
  const isNextPage = async (currentPage: number): Promise<boolean> => {
    console.log(`Current Page: ${currentPage}`);
    // Select the last <a> tag that matches the criteria
    const lastPageElement = await page.$(
      'a[href^="javascript:pageObj.sendPage"]:not(.btn_last):not(.disabled):last-of-type'
    );

    if (lastPageElement) {
      // Get the total page number from the inner text of the selected <a> tag
      const totalPageNum: number = Number(
        await page.evaluate((el) => parseInt(el.innerText), lastPageElement)
      );

      console.log(`Total Pages: ${totalPageNum}`);

      if (currentPage < totalPageNum) {
        // Navigate to the next page using the correct page number
        const nextPageNum: number = currentPage * 50 + 1;
        const nextPageLinks = await page.$$(
          'a[href^="javascript:pageObj.sendPage"]'
        );

        // Debug: Print available pagination links
        for (const link of nextPageLinks) {
          const href = await page.evaluate(
            (el) => el.getAttribute('href'),
            link
          );
          console.log(`Found link: ${href}`);
        }

        // Attempt to find and click the correct next page link
        for (const link of nextPageLinks) {
          const href = await page.evaluate(
            (el) => el.getAttribute('href'),
            link
          );
          if (href === `javascript:pageObj.sendPage('${nextPageNum}');`) {
            console.log(`Navigating to Page: ${nextPageNum}`);
            await link.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            return true;
          }
        }

        console.log(`Next Page Button not found for: ${nextPageNum}`);
      } else {
        console.log('No more pages to navigate.');
      }
    } else {
      console.log('Last Page Element not found.');
    }
    return false;
  };

  // Loop to scrape all pages
  let currentPage: number = 1;
  let hasNextPage: boolean;

  do {
    await scrapePage();
    hasNextPage = await isNextPage(currentPage++);
  } while (hasNextPage);

  await browser.close();

  fs.writeFile('./output.json', JSON.stringify(playList), (err) =>
    console.log(err)
  );
};

melonList();
