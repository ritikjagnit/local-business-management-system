from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

app = FastAPI(title="GrowthSystem AI Microservice")

class SalesDataInput(BaseModel):
    months: list[str]
    revenue: list[float]

@app.post("/predict/growth")
def predict_growth(data: SalesDataInput):
    if len(data.revenue) < 2:
        return {"predictedIncrease": "Need more data", "trend": "steady"}
        
    df = pd.DataFrame({
        'month_index': range(len(data.revenue)),
        'revenue': data.revenue
    })
    
    model = LinearRegression()
    # Reshape for sklearn
    X = df[['month_index']]
    y = df['revenue']
    model.fit(X, y)
    
    # Predict next month (index = len)
    next_month_pred = model.predict([[len(data.revenue)]])[0]
    last_month_actual = data.revenue[-1]
    
    if last_month_actual == 0:
        pct_increase = 0
    else:
        pct_increase = ((next_month_pred - last_month_actual) / last_month_actual) * 100
        
    trend = "upward" if pct_increase > 0 else "downward"
    
    return {
        "predictedIncrease": f"{pct_increase:.1f}%",
        "trend": trend,
        "next_month_prediction": float(next_month_pred)
    }

class ProductDataInput(BaseModel):
    product_names: list[str]
    quantities: list[int]

@app.post("/predict/insights")
def generate_insights(data: ProductDataInput):
    if not data.product_names:
        return {"insights": ["Start selling to see AI insights!"]}
        
    df = pd.DataFrame({
        'name': data.product_names,
        'quantity': data.quantities
    })
    
    # Group by name instead of assuming unique items
    grouped = df.groupby('name').sum().reset_index()
    
    if grouped.empty:
         return {"insights": ["Start selling to see AI insights!"]}
    
    top_product = grouped.loc[grouped['quantity'].idxmax()]
    total_items = grouped['quantity'].sum()
    
    insights = [
        f"'{top_product['name']}' is your top selling product right now.",
        f"You have sold a total volume of {total_items} items.",
        "Peak sales hour predicted to be 4 PM to 6 PM based on standard consumer patterns."
    ]
    
    return {"insights": insights}
