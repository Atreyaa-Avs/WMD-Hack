from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pathlib import Path
import json

app = FastAPI()

BASE_DIR = Path("test_data_dir")

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allow this origin
    allow_credentials=True,       # allow cookies/auth headers
    allow_methods=["*"],          # allow all HTTP methods
    allow_headers=["*"],          # allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is running on port 5000!"}

@app.get("/status")
def get_status():
    return {"status": "OK", "port": 5000}

@app.get("/data/{phone_no}")
def get_data(phone_no: int):
    folder_path = BASE_DIR / str(phone_no)
    
    # Check if folder exists
    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(status_code=404, detail="Folder not found")

    combined_data = {}

    # List of expected JSON files
    json_files = [
        "fetch_bank_transactions.json",
        "fetch_credit_report.json",
        "fetch_epf_details.json",
        "fetch_mf_transactions.json",
        "fetch_net_worth.json",
        "fetch_stock_transactions.json"
    ]

    for file_name in json_files:
        file_path = folder_path / file_name
        if file_path.exists():
            with open(file_path, "r") as f:
                try:
                    combined_data[file_name.replace(".json", "")] = json.load(f)
                except json.JSONDecodeError:
                    combined_data[file_name.replace(".json", "")] = {"error": "Invalid JSON"}
        else:
            # Optional: handle missing files
            combined_data[file_name.replace(".json", "")] = None

    return combined_data

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)