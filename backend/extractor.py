import requests
from bs4 import BeautifulSoup
import re
import json

def get_rental_listing_from_domain(address: str):
    # URL encode the address for the query parameter
    encoded_address = requests.utils.quote(address)
    url = f'https://www.domain.com.au/building-profile/{encoded_address}?filtertype=forRent&pagesize=100&pageno=1'
    headers = {'User-Agent': 'Mozilla/5.0'}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')

        property_divs = soup.find_all('div', {'data-testid': 'nearby-properties__on-market-property'})
        
        if property_divs:
            property_list = []

            for div in property_divs:
                try:
                    price_div = div.find('div', {'data-testid': 'nearby-properties__display-price'})
                    raw_price = price_div.get_text(strip=True) if price_div else "Not specified"
                    price_match = re.match(r"\$\d+", raw_price)
                    price = price_match.group() if price_match else "Not specified"

                    address_div = div.find('a', {'class': 'css-18urg6m'})
                    address = address_div.get_text(strip=True) if address_div else "Address not available"

                    features_div = div.find('div', {'data-testid': 'property-features-wrapper'})
                    features = features_div.find_all('span', {'data-testid': 'property-features-text-container'}) if features_div else []
                    beds = features[0].get_text(strip=True).replace("Beds", "").replace("Bed", "").strip() if len(features) > 0 else "0"
                    baths = features[1].get_text(strip=True).replace("Baths", "").replace("Bath", "").strip() if len(features) > 1 else "0"

                    beds = "-" if beds.startswith("\u2212") else beds
                    baths = "-" if baths.startswith("\u2212") else baths

                    parking = features[2].get_text(strip=True) if len(features) > 2 else "0"
                    parking = features[2].get_text(strip=True).replace("Parking", "").strip() if len(features) > 1 else "0"
                    parking = "-" if parking.startswith("\u2212") else parking

                    property_json = {
                        "price": price,
                        "address": address,
                        "beds": beds,
                        "baths": baths,
                        "parking": parking
                    }
                    property_list.append(property_json)
                except Exception as e:
                    print(f"Error processing property: {e}")

            return property_list
            # with open('data.json', 'w') as f:
            #     json.dump(property_list, indent=4, fp=f)
                
    else:
        print(f'Failed to retrieve the page. Status code: {response.status_code}')
        return 0