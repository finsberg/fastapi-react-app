from fastapi.testclient import TestClient

from app.core.security import verify_password


def test_create_user(client: TestClient, prefix: str):

    # Create user
    sent_data = {
        "username": "testuser",
        "email": "testuser@gmail.com",
        "password": "secret_password",
        "firstName": "Test",
        "lastName": "User",
        "isAdmin": True,
    }
    response = client.post(
        prefix + "/users/",
        json=sent_data,
    )

    # Make sure the user we got back is the same as the
    # data we sent
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "hashed_password" in data
    for k, v in sent_data.items():
        if k == "password":
            continue
        assert v == data[k], k


def test_create_existing_user_raises_409(client: TestClient, prefix: str):

    # Create a user
    sent_data = {
        "username": "testuser",
        "email": "testuser@gmail.com",
        "password": "secret_password",
        "firstName": "Test",
        "lastName": "User",
        "isAdmin": True,
    }
    client.post(
        prefix + "/users/",
        json=sent_data,
    )

    # Try to create the same user
    response = client.post(
        prefix + "/users/",
        json=sent_data,
    )
    assert response.status_code == 409


def test_get_current_user(client: TestClient, prefix: str):

    # Get the current user
    response = client.get(prefix + "/users/me")
    assert response.status_code == 200
    data = response.json()

    # Make sure this matches what is in the conftest.py
    assert data["lastName"] == "User"
    assert data["isAdmin"] is False
    assert data["username"] == "currentuser"
    assert data["email"] == "currentuser@gmail.com"
    assert data["firstName"] == "Current"
    assert verify_password("verylongpassword", data["hashed_password"])


def test_update_user(client: TestClient, prefix: str):

    # Create a user
    sent_data = {
        "username": "testuser",
        "email": "testuser@gmail.com",
        "password": "secret_password",
        "firstName": "Test",
        "lastName": "User",
        "isAdmin": True,
    }
    response = client.post(
        prefix + "/users/",
        json=sent_data,
    )

    # Updated data
    updated_data = {
        "username": "testuser",
        "email": "testuser@gmail.com",
        "password": "secret_password",
        "firstName": "UpdatedTest",
        "lastName": "User",
        "new_password": "new_secret_password",
        "isAdmin": False,
        "id": response.json()["id"],
    }
    # Update user
    updated_response = client.put(
        prefix + f"/users/{updated_data['id']}", json=updated_data
    )
    assert updated_response.status_code == 200
    data = updated_response.json()
    # Check only the fields that changed
    assert data["firstName"] == updated_data["firstName"]
    assert data["isAdmin"] == updated_data["isAdmin"]
    # Check that password has been updated
    assert verify_password(updated_data["new_password"], data["hashed_password"])


def test_update_user_with_wrong_password_raises_401(client: TestClient, prefix: str):

    # Create a user
    sent_data = {
        "username": "testuser",
        "email": "testuser@gmail.com",
        "password": "secret_password",
        "firstName": "Test",
        "lastName": "User",
        "isAdmin": True,
    }
    response = client.post(
        prefix + "/users/",
        json=sent_data,
    )

    # Update user, but use the wrong password
    updated_data = {
        "password": "wrong_password",
        "new_password": "new_secret_password",
        "id": response.json()["id"],
    }
    updated_response = client.put(
        prefix + f"/users/{updated_data['id']}", json=updated_data
    )
    assert updated_response.status_code == 401
