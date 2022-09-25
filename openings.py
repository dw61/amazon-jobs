import json
import bs4
import selenium
from selenium import webdriver

url = "https://www.amazon.jobs/en/search?&category%5B%5D=software-development&job_type%5B%5D=Full-Time&country%5B%5D=USA"
moreTeamsButton = "#main-content > div.search-page > div > div > div.container > content > div > div > div.d-none.d-md-block.col-sm-4.search-page-filter > div.search-filters > div:nth-child(9) > div > div.show-all > fieldset > button"
cities = ["Seattle", "New York", "Arlington", "Austin", "Bellevue", "Sunnyvale", "Boston", "East Palo Alto", "San Francisco", "Dallas", "Cupertino", "Herndon", "Santa Clara", "Redmond", "San Diego", "Santa Monica", "Culver City", "Atlanta", "Irvine", "Jersey City", "Denver", "Palo Alto", "Portland", "Tempe", "Newark", "Minneapolis", "Nashville", "Boulder", "Detroit", "Chicago", "Miami", "Cambridge", "San Luis Obispo", "North Reading", "Hawthorne", "Westborough", "Los Angeles", "Pennsylvania Furnace", "Northridge", "Annapolis Junction", "Houston", "Phoenix", "Raleigh", "Troy", "Santa Cruz", "Charlotte", "Florence", "Hudson", "Pasadena", "Pittsburgh", "San Jose", "Lehi", "Salt Lake City", "West Valley City", "Chantilly", "Charleston", "Durham", "Louisville", "North Charleston", "Philadelphia", "Washington", "Auburn", "Berkeley", "Brisbane", "Cincinnati", "Glendale", "Grand Haven", "Hebron", "Hilliard", "Las Vegas", "Madison", "Malvern", "Miami Beach", "Orlando", "Santa Barbara", "Tukwila", "Vancouver", "West Hollywood", "Wilmington"]
openings = {}

for city in cities:

    print(city)
    driver = webdriver.Safari()
    driver.get(f"{url}&city%5B%5D={city.replace(' ', '%20')}")

    try:
        button = driver.find_element("css selector", moreTeamsButton)
        while True:
            button.click()
    except (selenium.common.exceptions.NoSuchElementException, selenium.common.exceptions.StaleElementReferenceException):
        pass

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
