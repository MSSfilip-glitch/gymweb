import httpx
import json

mgmt_url = "http://localhost:1234/api/v1"
model_key = "deepseek/deepseek-r1-0528-qwen3-8b"

def probe(payload):
    print(f"Probing with payload: {payload}")
    try:
        resp = httpx.post(f"{mgmt_url}/models/load", json=payload, timeout=30)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
    except Exception as e:
        print(f"Error: {e}")

print("--- PROBING LM STUDIO LOAD ENDPOINT ---")
# Try potential payload keys
probe({"model": model_key})
probe({"model_key": model_key})
probe({"identifier": model_key})
probe({"modelId": model_key})
