# TODO list

This is an implementation of a TODO list.

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
{"message":"OK"}
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
