from fastapi.testclient import TestClient
from main import app, REJECTION_MESSAGE

client = TestClient(app)

def test_valid_headline():
    article = "Apple has unveiled its latest lineup of iPhones, featuring several AI-powered tools aimed at improving user experience."
    response = client.post("/classify", json={"text": article})
    print(f"Valid Article Response: {response.status_code}, {response.json()}")
    assert response.status_code == 200
    assert response.json()["category"] == "Technology & Computing"

def test_invalid_gibberish():
    gibberish_inputs = ["dhaks", "asdfghjkl", "12345 67890", "qwertyuiop"]
    for text in gibberish_inputs:
        response = client.post("/classify", json={"text": text})
        print(f"Invalid Input '{text}' Response: {response.status_code}, {response.json()}")
        assert response.status_code == 400
        assert response.json()["detail"] == REJECTION_MESSAGE

if __name__ == "__main__":
    test_valid_headline()
    test_invalid_gibberish()
    print("All unit tests passed successfully!")
