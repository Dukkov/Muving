"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const melonList = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    const url = 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm?plylstSeq=501620449';
    yield page.goto(url);
    const playList = [];
    const scrapePage = () => __awaiter(void 0, void 0, void 0, function* () {
        yield page.waitForSelector('td.t_left');
        const elements = yield page.$$('td.t_left');
        for (let i = 0; i < elements.length; i += 4) {
            const titleAnchorHandles = yield elements[i].$$('a');
            const artistAnchorHandles = yield elements[i + 1].$$('a');
            const albumAnchorHandles = yield elements[i + 2].$$('a');
            const title = yield page.evaluate((el) => el.innerText, titleAnchorHandles[titleAnchorHandles.length - 1]);
            const artist = yield page.evaluate((el) => el.innerText, artistAnchorHandles[artistAnchorHandles.length - 1]);
            const album = yield page.evaluate((el) => el.innerText, albumAnchorHandles[albumAnchorHandles.length - 1]);
            playList.push({
                title,
                artist,
                album
            });
        }
    });
    const isNextPage = (currentPage) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Current Page: ${currentPage}`);
        const lastPageElement = yield page.$('a[href^="javascript:pageObj.sendPage"]:not(.btn_last):not(.disabled):last-of-type');
        if (lastPageElement) {
            const totalPageNum = Number(yield page.evaluate((el) => parseInt(el.innerText), lastPageElement));
            console.log(`Total Pages: ${totalPageNum}`);
            if (currentPage < totalPageNum) {
                const nextPageNum = currentPage * 50 + 1;
                const nextPageLinks = yield page.$$('a[href^="javascript:pageObj.sendPage"]');
                for (const link of nextPageLinks) {
                    const href = yield page.evaluate((el) => el.getAttribute('href'), link);
                    console.log(`Found link: ${href}`);
                }
                for (const link of nextPageLinks) {
                    const href = yield page.evaluate((el) => el.getAttribute('href'), link);
                    if (href === `javascript:pageObj.sendPage('${nextPageNum}');`) {
                        console.log(`Navigating to Page: ${nextPageNum}`);
                        yield link.click();
                        yield page.waitForNavigation({ waitUntil: 'networkidle2' });
                        return true;
                    }
                }
                console.log(`Next Page Button not found for: ${nextPageNum}`);
            }
            else {
                console.log('No more pages to navigate.');
            }
        }
        else {
            console.log('Last Page Element not found.');
        }
        return false;
    });
    let currentPage = 1;
    let hasNextPage;
    do {
        yield scrapePage();
        hasNextPage = yield isNextPage(currentPage++);
    } while (hasNextPage);
    yield browser.close();
    fs_1.default.writeFile('./output.json', JSON.stringify(playList), (err) => console.log(err));
});
melonList();
