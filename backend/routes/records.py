import shutil
from pathlib import Path
from fastapi import APIRouter, File, UploadFile, HTTPException

# 1. Initialize the router
router = APIRouter()

# 2. Define the directory where uploads will be saved
UPLOAD_DIR = Path("uploads")

# Ensure the 'uploads' directory exists. 
# parents=True creates any necessary parent folders, exist_ok=True prevents errors if it already exists.
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# 3. Create the POST endpoint for file uploads
@router.post("/upload-record", summary="Upload a medical record")
async def upload_record(file: UploadFile = File(...)):
    """
    Accepts a file upload (e.g., PDF, image, or text) and saves it securely 
    to the local 'uploads' directory.
    """
    try:
        # Create the full destination path for the file
        file_path = UPLOAD_DIR / file.filename
        
        # Open the destination file in write-binary mode and copy the contents
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {
            "status": "success",
            "message": "File uploaded successfully.",
            "filename": file.filename
        }
        
    except Exception as e:
        # Catch file writing or permission errors
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while saving the file: {str(e)}"
        )
    finally:
        # Always close the uploaded file to free up server memory/resources
        file.file.close()


# 4. Create the GET endpoint to list uploaded files
@router.get("/", summary="List all uploaded medical records")
async def list_records():
    """
    Scans the 'uploads' directory and returns a list of all saved file names.
    """
    try:
        # Iterate through the directory and extract names of files (ignoring subdirectories)
        files = [f.name for f in UPLOAD_DIR.iterdir() if f.is_file()]
        
        return {
            "status": "success",
            "total_records": len(files),
            "data": files
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while retrieving records: {str(e)}"
        )