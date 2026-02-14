import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

class ExpenseAnomalyDetector:
    def __init__(self, model_path='model.pkl'):
        self.model_path = model_path
        self.model = None
        # Hyperparameters chosen for anomaly detection in financial data
        self.clf = IsolationForest(
            n_estimators=100, 
            max_samples='auto', 
            contamination=0.05, # Expecting 5% outliers
            random_state=42
        )

    def train(self, data):
        """
        Train the Isolation Forest model on historical expense data.
        data: DataFrame with features ['amount', 'category_id', 'day_of_week', 'role_encoded']
        """
        # Feature Selection
        X = data[['amount', 'category_id', 'day_of_week', 'role_encoded']]
        
        # Train
        print("Training Isolation Forest model...")
        self.clf.fit(X)
        self.model = self.clf
        
        # Save model
        joblib.dump(self.model, self.model_path)
        print(f"Model saved to {self.model_path}")

    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            return True
        return False

    def predict(self, amount, category_id, day_of_week, role_encoded):
        """
        Predict if a single transaction is anomalous.
        Returns: { 'is_anomaly': bool, 'score': float }
        """
        if not self.model:
            if not self.load_model():
                raise Exception("Model not trained or loaded")

        # Prepare input vector
        X_new = [[amount, category_id, day_of_week, role_encoded]]
        
        # Predict: -1 for outliers, 1 for inliers
        prediction = self.model.predict(X_new)
        
        # Decision function: lower = more abnormal. Negative values are anomalies.
        score = self.model.decision_function(X_new)
        
        return {
            "is_anomaly": True if prediction[0] == -1 else False,
            "severity_score": float(score[0]),
            "confidence": f"{abs(float(score[0])):.4f}"
        }

# Example Mock Data Generation for initial Training
if __name__ == "__main__":
    # Create synthetic training data
    # Normal data: Small amounts for Food (Cat 1), Med for Travel (Cat 2)
    normal_data = {
        'amount': np.random.normal(50, 10, 100).tolist() + np.random.normal(200, 50, 50).tolist(),
        'category_id': [1]*100 + [2]*50,
        'day_of_week': np.random.randint(0, 5, 150), # Mon-Fri
        'role_encoded': [1]*150 # Employee
    }
    
    # Add some anomalies
    anomalies = {
        'amount': [5000, 20, 10000], 
        'category_id': [1, 2, 1], # $5000 Lunch
        'day_of_week': [6, 6, 6], # Sunday
        'role_encoded': [1, 1, 1]
    }
    
    df = pd.DataFrame(normal_data)
    # Convert anomalies to df and append (omitted for brevity, just training on normal mostly)
    
    detector = ExpenseAnomalyDetector()
    detector.train(df)
    
    # Test
    test_result = detector.predict(5000, 1, 6, 1)
    print(f"Test Result for $5000 Lunch on Sunday: {test_result}")
