from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import requests
import base64
import os
import random
from datetime import datetime

app = Flask(__name__)
app.secret_key = "mkra_demo_secret"

# Fictional user data
users = {
    "P123456789L": {"password": "demo123", "name": "John Mwangi"},
    "P987654321L": {"password": "demo456", "name": "Jane Achieng"}
}

# Fictional filing history
filings = {
    "P123456789L": [
        {"year": "2024", "status": "On Time", "prn": "2024050001234567", "amount": 1500},
        {"year": "2023", "status": "Late", "prn": "2023050001234567", "amount": 2000}
    ],
    "P987654321L": [
        {"year": "2024", "status": "On Time", "prn": "2024050009876543", "amount": 1200}
    ]
}

# KRA Sandbox credentials
KRA_ENV = os.getenv("KRA_ENV", "sandbox")
KRA_CONSUMER_KEY = os.getenv("KRA_CONSUMER_KEY", "your_consumer_key")
KRA_CONSUMER_SECRET = os.getenv("KRA_CONSUMER_SECRET", "your_consumer_secret")

def get_access_token():
    key_secret = f"{KRA_CONSUMER_KEY}:{KRA_CONSUMER_SECRET}"
    b64 = base64.b64encode(key_secret.encode()).decode()
    url = "https://sbx.kra.go.ke/v1/token/generate?grant_type=client_credentials" if KRA_ENV=="sandbox" else "https://api.kra.go.ke/v1/token/generate?grant_type=client_credentials"
    headers = {"Authorization": f"Basic {b64}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        pin = request.form.get("pin")
        password = request.form.get("password")
        user = users.get(pin)
        if user and user["password"] == password:
            session["user"] = pin
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", error="Invalid KRA PIN or password")
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))
    user_pin = session["user"]
    user_name = users[user_pin]["name"]
    return render_template("dashboard.html", name=user_name)

@app.route("/generate_prn", methods=["GET", "POST"])
def generate_prn():
    if "user" not in session:
        return redirect(url_for("login"))
    user_pin = session["user"]
    if request.method == "POST":
        # Collect form data
        tax_period_from = request.form.get("tax_period_from")
        tax_period_to = request.form.get("tax_period_to")
        gross_amount = float(request.form.get("gross_amount"))
        tax_rate = float(request.form.get("tax_rate"))
        landlord_pin = request.form.get("landlord_pin")
        invoice_no = request.form.get("invoice_no")
        invoice_date = request.form.get("invoice_date")
        payment_date = request.form.get("payment_date")
        
        # Generate transaction payload
        transaction_payload = {
            "transactionHeader": {
                "withholderPin": user_pin,
                "transactionUniqueNo": "TXN123456789",
                "noOfTransactions": 1,
                "taxObligation": "WHTRENT",
                "taxPeriodFrom": tax_period_from,
                "taxPeriodTo": tax_period_to,
                "totalGrossAmount": gross_amount,
                "totalTaxAmount": round(gross_amount * tax_rate / 100,2)
            },
            "transactionDetails": [
                {
                    "typeOfProperty": "Residential",
                    "landlordPin": landlord_pin,
                    "paymentDate": payment_date,
                    "invoiceNo": invoice_no,
                    "invoiceDate": invoice_date,
                    "lrNumber": "NAIROBI/BLOCK0/01",
                    "building": "A Tower",
                    "street": "Lasie Avenue",
                    "town": "Nairobi",
                    "grossAmount": gross_amount,
                    "taxRate": tax_rate,
                    "taxAmount": round(gross_amount * tax_rate / 100,2)
                }
            ]
        }
        
        # For demo purposes, generate fictional PRN data
        prn_data = {
            "prnNumber": f"PRN{random.randint(1000000000, 9999999999)}",
            "prnAmount": round(gross_amount * tax_rate / 100, 2),
            "prnDate": datetime.now().strftime("%Y-%m-%d"),
            "invoiceNumber": invoice_no,
            "invoiceDate": invoice_date,
            "taxPeriod": f"{tax_period_from} to {tax_period_to}",
            "landlordPin": landlord_pin,
            "grossAmount": gross_amount,
            "taxRate": tax_rate
        }
        
        # Add to user's filing history
        if user_pin not in filings:
            filings[user_pin] = []
        
        filings[user_pin].insert(0, {
            "year": tax_period_from[:4],
            "status": "Generated",
            "prn": prn_data["prnNumber"],
            "amount": prn_data["prnAmount"]
        })
        
        return render_template("generate_prn.html", success=True, prn=prn_data)
        
    return render_template("generate_prn.html")

@app.route("/history")
def history():
    if "user" not in session:
        return redirect(url_for("login"))
    user_pin = session["user"]
    user_history = filings.get(user_pin, [])
    return render_template("history.html", filings=user_history)

@app.route("/logout")
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True, port=5001)