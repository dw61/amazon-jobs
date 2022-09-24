import json
import bs4
import selenium
from selenium import webdriver

url = "https://www.amazon.jobs/en/search?&category%5B%5D=software-development&job_type%5B%5D=Full-Time&country%5B%5D=USA&city%5B%5D=Seattle"
moreTeamsButton = "#main-content > div.search-page > div > div > div.container > content > div > div > div.d-none.d-md-block.col-sm-4.search-page-filter > div.search-filters > div:nth-child(9) > div > div.show-all > fieldset > button"
data = {}

driver = webdriver.Safari()
driver.get(url)
button = driver.find_element("css selector", moreTeamsButton)

while True:
    try:
        button.click()
    except selenium.common.exceptions.StaleElementReferenceException:
        break # no more teams to load

soup = bs4.BeautifulSoup(driver.page_source, 'html.parser')
driver.quit()

teams = soup.find_all("button", {"name":"desktopFilter_business_category"})

# AWS Seattle Data not accurate
city = "Seattle"
data[city] = []
for team in teams:
    organization, _, headcount, _, _ = team.strings
    data[city].append([organization, int(headcount.replace("+", ""))])

with open("data.json", "w") as f:
    json.dump(data, f)
