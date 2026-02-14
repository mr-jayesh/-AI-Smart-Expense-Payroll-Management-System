from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from anomaly_detector import ExpenseAnomalyDetector
import uvicorn
import os

app = FastAPI(title="AI Expense Anomaly Service")

# Initialize Detector
detector = ExpenseAnomalyDetector()

# Check if model exists, else we might need to train (simplified)
if not os.path.exists('model.pkl'):
    print("Warning: Model not found. Please run training script first.")

class ExpenseItem(BaseModel):
    amount: float
    category_id: int
    day_of_week: int # 0=Mon, 6=Sun
    role_encoded: int # 1=Employee, 2=Manager

@app.get("/health")
def health_check():
    return {"status": "active", "service": "AI Engine"}

@app.get("/")
def root():
    return {"message": "AI Engine is Running!"}

@app.post("/predict/anomaly")
def predict_anomaly(item: ExpenseItem):
    try:
        # Load model lazily
        if not detector.load_model():
             # For demo purposes, if no model, return mock response
             return {"status": "error", "message": "Model not trained yet."}

        result = detector.predict(
            item.amount, 
            item.category_id, 
            item.day_of_week, 
            item.role_encoded
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Use reload=False for better stability in scripts, or ensure main guard
    uvicorn.run(app, host="0.0.0.0", port=8000)
