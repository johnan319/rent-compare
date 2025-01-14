from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from extractor import get_rental_listing_from_domain

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/listings/{address}")
def read_listings(address: str):
    print(address)
    return get_rental_listing_from_domain(address)
