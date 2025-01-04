from fastapi import FastAPI
from extractor import get_rental_listing_from_domain

app = FastAPI()

@app.get("/")
def read_root():
    return get_rental_listing_from_domain()
