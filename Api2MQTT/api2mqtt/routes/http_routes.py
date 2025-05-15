from fastapi import APIRouter
import httpx

router = APIRouter()

@router.post("/request")
async def manual_http_request(url: str):
    try:
        response = await httpx.get(url)
        return {"status": "success", "data": response.text}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/request")
async def manual_http_request(url: str):
    import httpx
    try:
        response = await httpx.get(url)
        return {"status": "success", "data": response.text}
    except Exception as e:
        return {"status": "error", "message": str(e)}
