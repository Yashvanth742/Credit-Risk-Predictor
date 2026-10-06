# 💳 Credit Risk Analyzer

An end-to-end Machine Learning application that predicts the probability of loan default and classifies applicants into **Low Risk** or **High Risk**.

## 🚀 Overview

Credit Risk Analyzer uses an **XGBoost machine learning model** to evaluate loan applications based on applicant income, employment, loan details, and credit history.

The trained model is integrated with a **FastAPI backend** and a web-based frontend to provide real-time credit risk predictions.

## ✨ Features

- 📊 Credit risk prediction using XGBoost
- 🔄 Numerical and categorical data preprocessing
- 🎯 Probability calibration using `CalibratedClassifierCV`
- ⚖️ Optimized classification threshold
- 🚀 FastAPI REST API
- 🌐 Interactive web interface
- 🔌 Frontend-to-API integration
- 📈 Default probability calculation
- 🛡️ Low Risk / High Risk classification
- ☁️ Deployed application

## 🧠 Machine Learning Workflow

1. Data preprocessing
2. Feature transformation
3. XGBoost model training
4. Hyperparameter optimization
5. Probability calibration
6. Threshold optimization
7. Model serialization
8. FastAPI integration
9. Frontend integration
10. Deployment

## 🛠️ Tech Stack

**Machine Learning**
- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost

**Backend**
- FastAPI
- Pydantic
- Uvicorn

**Frontend**
- HTML
- CSS
- JavaScript

## 📥 Input Features

The application accepts:

- Age
- Annual Income
- Home Ownership
- Employment Length
- Loan Intent
- Loan Grade
- Loan Amount
- Interest Rate
- Loan-to-Income Ratio
- Previous Default History
- Credit History Length

## 📤 Prediction Output

The API returns:

- Default Probability
- Classification Threshold
- Default Prediction
- Risk Classification

Example:

```json
{
  "default_probability": 0.23,
  "default_prediction": 0,
  "threshold": 0.69,
  "Result": "Low Risk"
}
