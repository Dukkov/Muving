from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from selenium.common.exceptions import TimeoutException

# Constants
URL = "https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm?plylstSeq=523926360"
WAIT_TIMEOUT = 60

options = webdriver.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")  ## Automation Info Bar 비활성화
options.add_argument("--disable-extensions")
options.add_argument("--disable-extensions-file-access-check")
options.add_argument("--disable-extensions-http-throttling")
options.add_argument("--disable-infobars")
options.add_argument("--disable-automation")
options.add_experimental_option("detach", True)                        ## 창을 닫더라도 드라이버 유지
options.add_experimental_option('excludeSwitches', ['enable-logging'])
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)

service = Service(executable_path=ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)
driver.get(URL)

try:
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#frm > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > div > div > a.fc_gray"))
    )
except TimeoutException:
    print("Timed out waiting for page to load. Element not found.")
    driver.quit()

# Get page source and parse it with BeautifulSoup
html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')
songs = []

# Now you can use BeautifulSoup as before
for i in range(1, 51):
    # Construct the CSS selectors for the current song
    title_selector = f'#frm > div > table > tbody > tr:nth-child({i}) > td:nth-child(3) > div > div > a.fc_gray'
    artist_selector = f'#artistName > a'  # Assuming this selector is common and not dependent on the song index
    album_selector = f'#frm > div > table > tbody > tr:nth-child({i}) > td:nth-child(5) > div > div > a'
    
    # Extract data using the CSS selectors
    title = soup.select_one(title_selector).text.strip()
    artist = soup.select_one(artist_selector).text.strip() if soup.select_one(artist_selector) else 'Unknown Artist'
    album = soup.select_one(album_selector).text.strip()

    # Append the song data as a tuple to the list
    songs.append((title, artist, album))

# Output the list of songs
for song in songs:
    print(song)

# Clean up: close the browser window
driver.quit()
