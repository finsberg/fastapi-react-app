from fastapi.testclient import TestClient


def test_health(client: TestClient, prefix: str):
    response = client.get(prefix + "/health/")
    assert response.status_code == 200
    assert response.json() == {"msg": "OK"}
