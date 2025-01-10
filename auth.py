from fastapi import FastAPI

app = FastAPI()

@app.get("/auth/login")
def read_root():
    return {"login"}


