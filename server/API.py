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

@app.get("/fetch_bank_transactions/{phone_no}")
def get_bank_txns_data(phone_no: int):
    folder_path = BASE_DIR / str(phone_no)
    file_name = "fetch_bank_transactions.json"

    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(status_code=404, detail="Folder not found")
    
    file_path = folder_path / file_name

    data = {}

    if file_path.exists():
        with open(file_path,"r") as f:
            try:
                data[file_name.replace(".json", "")] = json.load(f)
            except json.JSONDecodeError:
                data[file_name.replace(".json", "")] = {"error": "Invalid JSON"}
    else:
        # Optional: handle missing files
        data[file_name.replace(".json", "")] = None
    
    return data

@app.get("/fetch_credit_report/{phone_no}")
def get_credit_report_data(phone_no: int):
    folder_path = BASE_DIR / str(phone_no)
    file_name = "fetch_credit_report.json"

    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(status_code=404, detail="Folder not found")
    
    file_path = folder_path / file_name

    data = {}

    if file_path.exists():
        with open(file_path,"r") as f:
            try:
                data[file_name.replace(".json", "")] = json.load(f)
            except json.JSONDecodeError:
                data[file_name.replace(".json", "")] = {"error": "Invalid JSON"}
    else:
        # Optional: handle missing files
        data[file_name.replace(".json", "")] = None
    
    return data

@app.get("/fetch_epf_details/{phone_no}")
def get_epf_details_data(phone_no: int):
    folder_path = BASE_DIR / str(phone_no)
    file_name = "fetch_epf_details.json"
    file_path = folder_path / file_name

    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(status_code=404, detail="Folder not found")

    if not file_path.exists():
        return {"message": f"{file_name} not found for {phone_no}"}

    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"message": f"{file_name} contains invalid JSON"}
    
@app.get("/fetch_mf_transactions/{phone_no}")
def get_mf_txns(phone_no: int):
    folder_path = BASE_DIR / str(phone_no)
    file_name = "fetch_mf_transactions.json"
    file_path = folder_path / file_name

    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(status_code=404, detail="Folder not found")

    if not file_path.exists():
        return {"message": f"{file_name} not found for {phone_no}"}

    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"message": f"{file_name} contains invalid JSON"}
    
@app.get("/fetch_net_worth/{phone_no}")
def get_net_worth(phone_no: int):
    folder_path = BASE_DIR / str(phone_no)
    file_name = "fetch_net_worth.json"
    file_path = folder_path / file_name

    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(status_code=404, detail="Folder not found")

    if not file_path.exists():
        return {"message": f"{file_name} not found for {phone_no}"}

    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"message": f"{file_name} contains invalid JSON"}
    
@app.get("/fetch_stock_transactions/{phone_no}")
def get_stock_transactions(phone_no: int):
    folder_path = BASE_DIR / str(phone_no)
    file_name = "fetch_stock_transactions.json"
    file_path = folder_path / file_name

    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(status_code=404, detail="Folder not found")

    if not file_path.exists():
        return {"message": f"{file_name} not found for {phone_no}"}

    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"message": f"{file_name} contains invalid JSON"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)