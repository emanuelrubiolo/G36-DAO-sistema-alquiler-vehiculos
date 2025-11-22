from fastapi import FastAPI, Depends

#todo: modelos según bd
#todo: crear routers
#todo: crear esquemas
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World!!!"}
