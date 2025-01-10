from fastapi import FastAPI

app = FastAPI()


@app.get("/dashboard")
def read_root():
    return {"dashboard"}

