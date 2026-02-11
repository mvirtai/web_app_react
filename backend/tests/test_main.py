def test_root_returns_welcome(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Hello World!"


def test_health_returns_healthy(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "healthy"}
