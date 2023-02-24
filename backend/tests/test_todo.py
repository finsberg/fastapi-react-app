from fastapi.testclient import TestClient


def test_create_todo(client: TestClient, prefix: str):

    # Create a todo
    sent_data = {
        "title": "some title",
        "description": "some description",
        "status": False,
    }
    response = client.post(
        prefix + "/todo/",
        json=sent_data,
    )
    # Check that the request was successful
    assert response.status_code == 200
    # Make sure the data is the same that we sent
    data = response.json()
    assert "id" in data
    for k, v in sent_data.items():
        assert v == data[k], k


def test_update_todo(client: TestClient, prefix: str):

    # Create a todo
    sent_data = {
        "title": "some title",
        "description": "some description",
        "status": False,
    }
    post_response = client.post(
        prefix + "/todo/",
        json=sent_data,
    )

    # Modify the data
    todo_id = post_response.json()["id"]
    sent_data["title"] = "new title"
    # Update todo
    response = client.put(
        prefix + f"/todo/{todo_id}",
        json=sent_data,
    )
    # Check that the update was successful
    assert response.status_code == 200
    assert response.json()["title"] == "new title"


def test_delete_todo(client: TestClient, prefix: str):

    # Create a todo
    sent_data = {
        "title": "some title",
        "description": "some description",
        "status": False,
    }
    post_response = client.post(
        prefix + "/todo/",
        json=sent_data,
    )

    # Make sure we have one todo and that this is the same
    # as the one we sent
    data = post_response.json()
    response = client.get(
        prefix + "/todo/",
    )
    assert response.status_code == 200
    data_lst = response.json()
    assert len(data_lst) == 1
    assert data_lst[0] == data

    # Delete the todo
    delete_response = client.delete(prefix + f"/todo/{data['id']}")
    assert delete_response.status_code == 200

    # Make sure there are no more todos
    response = client.get(
        prefix + "/todo/",
    )
    assert response.status_code == 200
    data_lst = response.json()
    assert len(data_lst) == 0
