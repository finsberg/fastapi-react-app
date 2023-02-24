# Fast API + SQLModel + React example

This is an implementation of a simple TODO list with authentication using FastAPI, SQLModel and React.

## Tech stack

For the frontend we use
- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Chakra-UI](https://chakra-ui.com) for styling
- [Vite](https://vitejs.dev) for building

For the backend we use
- [FastAPI](https://fastapi.tiangolo.com) as web framework
- [SQLModel](https://sqlmodel.tiangolo.com) for interacting with the database

## Installation

### Installing the backend dependencies

If is recommended to first create a virtual environment.

```
python3 -m venv venv
```
and activate the virtual environment
```
. venv/bin/activate
```
Go in to the `backend` directory
```
cd backend
```
and install the dependencies
```
python3 -m pip install -r requirements.txt
```
Note that the dependencies are generated from the `requirements.in` file and compiled with [`pip-tools`](https://github.com/jazzband/pip-tools/).

If you want to run the tests you also need to install the dev-requirements, i.e
```
python3 -m pip install dev-requirements.txt
```


### Installing the frontend dependencies
First go in to the `frontend` directory
```
cd frontend
```
and then execute
```
npm install
```

## Running

Once you have installed the dependencies you can run both the backend and frontend server.

## Setting up the secrets
Before running the backend we need to set up the secrets. You do this by creating the file `backend/.env` with the following content
```
JWT_SECRET_KEY=my-secret
JWT_REFRESH_SECRET_KEY=another-secret
SQL_CONNECTION_STRING=sqlite:///database.db
```
See [.env.exmple](backend/.env.example) for an example file.

Of course the secret keys should be changed when moving to production. We will also use a simple SQLite database i.e `database.db` stored in the same folder. If you want to reset the database, you can just delete this file.


### Running the backend
We will use `uvicorn` to run the backend. Go in to the `backend` directory
```
cd backend
```
and execute the command
```
uvicorn app.main:app --reload --port 8000
```
Your backend server should now run at <http://localhost:8000>. You can verify that the server is running by pinging the server
```
curl localhost:8000/api/v1/health
```
You should now see the following output
```
{"msg":"OK"}
```
You can also go to `http://localhost:8000/docs` to see the OpenAPI documentation for the endpoints.

## Running the frontend
To run the frontend, go to the `frontend` directory
```
cd frontend
```
and execute
```
yarn dev
```
If you don't have `yarn` install, you can also use
```
npm run dev
```
The frontend server should now run on <http://localhost:5173/>, which you can open in the browser.


## Testing

There also automated tests

### Pre-commit hooks
There are set of pre-commit hooks defined in the [.pre-commit-config.yaml](.pre-commit-config.yaml) which will run linters and formatter on both the python and javascript code.

These are also run in the CI using [GitHub actions](.github/workflows/pre-commit.yml). If you want make sure that the pre-commit hooks are regularly updated, then you might consider to set up (pre-commit.ci)[http://pre-commit.ci] instead.

### Testing the backend
You can run the backend tests with pytest. First go to the `backend` directory
```
cd backend
```
and then run `pytest`
```
python3 -m pytest -vv
```
There is also a [GitHub action](.github/workflows/test_backend.yml) to run run the tests in CI.


### Testing the frontend
TODO
