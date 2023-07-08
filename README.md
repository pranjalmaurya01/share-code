# File Sharing Application

This is a file sharing application that allows users to share files in two modes: sharing the entire file or sharing code snippets.

## Features

-   Share entire files: Users can upload and share complete files of various types.
-   Share code snippets: Users can share specific sections of code by selecting the code and generating a code snippet.
-   Choose sharing mode: Users can switch between sharing the entire file or sharing code snippets.
-   Secure sharing: The application ensures secure sharing of files and code snippets.
-   File management: Users can view and manage their shared files, including deleting files or updating code snippets.

## Technologies Used

-   Front-end: [Next.js](https://nextjs.org/), [shadcn-ui](https://ui.shadcn.com/), [Zustand](https://github.com/pmndrs/zustand)
-   Back-end: [Socket.IO](https://socket.io/), [Redis](https://upstash.com/)

## Development Server Setup

To start the development server for the file sharing application, follow these steps:

### Prerequisites

Before proceeding, ensure that you have the following installed on your machine:

-   [Node.js](https://nodejs.org/) (version 18 or above)
-   [npm](https://www.npmjs.com/) (or [Yarn](https://yarnpkg.com/))

Rename back/.env.sample to back/.env and enter your own REDIS_TOKEN from [Redis](https://upstash.com/)

### Docker Setup Instructions

1. VS Code will detect the `.devcontainer` folder and prompt you to reopen the project in the container. Click on the "Reopen in Container" button.

2. VS Code will automatically build and configure the development environment based on the `.devcontainer` configuration. This ensures that all necessary dependencies and extensions are installed within the container.

3. Once the container is up and running, development server will start automatically on ports (3000,3333).

### Manual Setup Instructions

1. Clone the repository:

    ```bash
    git clone https://github.com/pranjalmaurya01/share-code.git
    ```

2. cd into frontend and backend and :
    ```bash
    cd front && npm i && cd ../back && npm i
    ```
3. run dev server frontend (PORT: 3000)

    ```bash
    cd front && npm run dev
    ```

4. run dev server backend (PORT: 3333)
    ```bash
    cd back && npm run dev
    ```
