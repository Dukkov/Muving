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
const melonScraper = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    yield page.goto(url, { waitUntil: 'networkidle2' });
    const playList = [];
    let idCounter = 1;
    const scrapePage = (pageNumber) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.waitForSelector('tbody tr');
        const rows = yield page.$$('tbody tr');
        console.log(`Scraping ${rows.length} rows on page ${pageNumber}`);
        for (const row of rows) {
            const title = yield row.$eval('td:nth-child(3) a.fc_gray', (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
            const artist = yield row.$eval('td:nth-child(4) a.fc_mgray', (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
            const album = yield row.$eval('td:nth-child(5) a.fc_mgray', (el) => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
            playList.push({
                id: idCounter++,
                title,
                artist,
                album
            });
        }
    });
    const navigateToNextPage = (currentPage) => __awaiter(void 0, void 0, void 0, function* () {
        const nextPageNumber = currentPage * 50 + 1;
        const nextPageSelector = `a[href="javascript:pageObj.sendPage('${nextPageNumber}');"]`;
        const nextButton = yield page.$(nextPageSelector);
        if (nextButton) {
            console.log(`Navigating to page ${nextPageNumber / 50 + 1}...`);
            yield Promise.all([
                nextButton.click(),
                page.waitForNavigation({ waitUntil: 'networkidle2' })
            ]);
            yield new Promise((resolve) => setTimeout(resolve, 2000));
            return true;
        }
        return false;
    });
    let currentPage = 1;
    let hasNextPage;
    do {
        yield scrapePage(currentPage);
        hasNextPage = yield navigateToNextPage(currentPage);
        currentPage++;
    } while (hasNextPage);
    yield browser.close();
    return playList;
});
exports.default = melonScraper;
