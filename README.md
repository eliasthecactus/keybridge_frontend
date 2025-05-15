# KeyBridge Frontend

The KeyBridge Frontend is the user interface component of the KeyBridge system. It interacts with the KeyBridge API, providing administrators and users with a visual interface to manage applications, users, and monitor activities.

## Features
- User-friendly interface for administrators
- Application and user management
- Display of user logs and activity reports
- Integration with the KeyBridge Server for secure communication
- Easy configuration of authentication providers and application paths

## Requirements
Check the `requirements.txt`

To install the required packages with `npm` or `yarn`:
```bash
npm install
# or
yarn install
```

## Setup
### 1. Clone the repository:
```bash
git clone https://github.com/eliasthecactus/keybridge-frontend
```

### 2. Install the required packages:
```bash
npm install
# or
yarn install
```

### 3. Configure environment variables:
Create a `.env` file and configure the variables:
```bash
cp .env-sample .env
# Configure the variables
```

### 4. Start the frontend:
```bash
npm start
# or
yarn start
```

The KeyBridge Frontend is now accessible at `http://localhost:3000`.

### Docker Setup
You can also run the KeyBridge Frontend using Docker.

You can override the environment variables by specifying them when running the container (-e):

| Environment Variable        | Description                                          | Default Value        |
|-----------------------------|------------------------------------------------------|----------------------|
| `API_URL`                    | The URL for the KeyBridge API                       | `http://localhost:5000` |
| `API_PORT`                   | The port for the KeyBridge API                      | `5000`               |

#### Option 1: Using GitHub Container Registry (GHCR)
You can pull the prebuilt Docker image from the GitHub Container Registry:

```bash
docker pull ghcr.io/eliasthecactus/keybridge-frontend:latest
```

Then run the container:
```bash
docker run -d -p 3000:3000 ghcr.io/eliasthecactus/keybridge-frontend:latest
```

#### Option 2: Building from Dockerfile
Clone the repository and build the Docker image directly:

```bash
git clone https://github.com/eliasthecactus/keybridge-frontend
cd keybridge-frontend
docker build -t keybridge-frontend .
docker run -d -p 3000:3000 keybridge-frontend
```

## Notes
- This frontend interacts with the KeyBridge Server to provide a secure and user-friendly interface.
- Customizations can be made to integrate the frontend with your organization's specific needs.

## License
This project is licensed under the KeyBridge License. See the [LICENSE](LICENSE) file for details.