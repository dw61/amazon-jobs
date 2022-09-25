import json
import bs4
import selenium
from selenium import webdriver

url = "https://www.amazon.jobs/en/search?&category%5B%5D=software-development&job_type%5B%5D=Full-Time&country%5B%5D=USA"
moreTeamsButton = "#main-content > div.search-page > div > div > div.container > content > div > div > div.d-none.d-md-block.col-sm-4.search-page-filter > div.search-filters > div:nth-child(9) > div > div.show-all > fieldset > button"
cities = ["Seattle", "New York", "Arlington", "Austin", "Bellevue"]
openings = {}

for city in cities:

    driver = webdriver.Safari()
    driver.get(f"{url}&city%5B%5D={city.replace(' ', '%20')}")
    button = driver.find_element("css selector", moreTeamsButton)

    while True:
        try:
            button.click()
        except selenium.common.exceptions.StaleElementReferenceException:
            break # no more teams to load

    soup = bs4.BeautifulSoup(driver.page_source, 'html.parser')
    driver.quit()

    teams = soup.find_all("button", {"name":"desktopFilter_business_category"})

    # AWS Seattle openings not accurate
    openings[city] = []
    for team in teams:
        organization, _, opening, _, _ = team.strings
        openings[city].append([organization, int(opening.replace("+", ""))])

with open("openings.json", "w") as f:
    json.dump(openings, f)
