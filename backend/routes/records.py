import os
import shutil
from datetime import datetime
from fastapi import APIRouter, File, UploadFile, HTTPException

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-record")
async def upload_record(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"status": "success", "message": "File uploaded successfully", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@router.get("/records")
async def list_records():
    try:
        files = []
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.isfile(file_path):
                size_kb = round(os.path.getsize(file_path) / 1024, 2)
                mod_time = os.path.getmtime(file_path)
                upload_date = datetime.fromtimestamp(mod_time).strftime("%Y-%m-%d %H:%M:%S")
                files.append({
                    "filename": filename,
                    "url": f"http://localhost:8000/uploads/{filename}",
                    "size_kb": size_kb,
                    "upload_date": upload_date
                })
        files.sort(key=lambda x: x["upload_date"], reverse=True)
        return {"status": "success", "data": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch records: {str(e)}")

# --- NEW: Delete a single file ---
@router.delete("/records/{filename}")
async def delete_record(filename: str):
    try:
        # Secure the filename to prevent directory traversal attacks
        secure_filename = os.path.basename(filename)
        file_path = os.path.join(UPLOAD_DIR, secure_filename)
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            os.remove(file_path)
            return {"status": "success", "message": f"Deleted {secure_filename}"}
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")

# --- NEW: Delete all files ---
@router.delete("/records")
async def delete_all_records():
    try:
        deleted_count = 0
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
                deleted_count += 1
        return {"status": "success", "message": f"Deleted {deleted_count} records"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete all files: {str(e)}")