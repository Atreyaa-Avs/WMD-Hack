from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)