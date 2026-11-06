# EcoDrive – Smart Vehicle Pollution Control & PUC Management System

EcoDrive is a web-based **Pollution Under Control (PUC) Certificate Management System** designed to simplify vehicle pollution certificate tracking, automate expiry monitoring, and support enforcement of pollution regulations.

The system connects vehicle owners, PUC testing centre staff, and police through a centralized platform. It helps vehicle owners monitor certificate validity, allows authorized PUC updaters to upload new certificates, and enables police to identify vehicles with overdue certificates.

---

## 1. Project Objectives

- Digitize the process of managing vehicle PUC certificates.
- Allow vehicle owners to track their vehicle details and certificate validity.
- Enable PUC testing centre staff to upload and update certificates.
- Automatically calculate certificate expiry dates.
- Help users identify certificates approaching expiry or already expired.
- Forward vehicles with overdue certificates to the police after the grace period.
- Provide police with a centralized interface to manage forwarded vehicles.

## 2. Key Features

### User Authentication and Role-Based Access

EcoDrive supports different user roles with access to specific functionalities:

- **Vehicle Owner:** Register, log in, add vehicles, and track PUC certificate status.
- **PUC Updater:** Upload and update PUC certificates for registered vehicles.
- **Police:** View vehicles forwarded for overdue PUC certificates and mark enforcement actions as completed.
- **Admin:** Access administrative functionality.

### Vehicle Management

- Register and manage vehicle details.
- Store registration number, manufacturer, model, fuel type, and other vehicle information.
- View registered vehicles and their associated PUC certificates.

### PUC Certificate Management

- Upload PUC certificate details.
- Store certificate information and test results.
- Calculate certificate expiry dates automatically.
- View uploaded certificates.

### Automatic PUC Status Tracking

The system determines certificate status based on its expiry date:

| Status | Description |
|---|---|
| Valid | Certificate has more than 10 days remaining. |
| Expiring Soon | Certificate expires within 10 days. |
| Expired – Update Pending | Certificate has expired, but the 10-day grace period is still active. |
| Forwarded to Police | The 10-day grace period has elapsed. |
| Caught by Police | Police have marked the vehicle as caught. |

Uploading a new PUC certificate starts a new tracking cycle and resets the previous police-caught status.

### Police Overdue Management

- Display vehicles forwarded after the grace period.
- Search vehicles using registration numbers.
- View vehicle and certificate details.
- Sort overdue vehicles by expiry date.
- Mark vehicles as caught through a confirmation action.
- Synchronize the caught status across the system.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JSON Web Tokens (JWT) |
| API Communication | REST APIs |
| File Upload | Multer and Cloudinary |
| Development Tools | VS Code, Git, GitHub, Postman |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

---

## 4. System Architecture

EcoDrive follows a client-server architecture.

1. The React frontend provides the user interface.
2. The frontend communicates with the backend using REST API requests.
3. The Express.js backend handles authentication, vehicle management, and PUC operations.
4. MongoDB stores user, vehicle, and certificate information.
5. Cloudinary is used for certificate file storage.
6. The backend processes certificate expiry information and determines vehicle status.
7. The frontend displays the latest information based on the authenticated user's role.

---

## 5. Project Folder Structure

```text
EcoDrive/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
└── README.md
```

*Note: The structure above shows the main project directories. Actual files and folders may vary slightly.*

---

## 6. Installation and Setup

Follow these steps to run EcoDrive on your local machine.

### Prerequisites

Install the following software and create the required accounts:

- **Node.js and npm:** To run the frontend and backend.
- **MongoDB Atlas account:** To host the database, or use a local MongoDB installation.
- **Cloudinary account:** To store uploaded PUC certificates.
- **Visual Studio Code:** Recommended code editor.
- **Web browser:** Google Chrome or any modern browser.

### Step 1: Download the Project

1. Open the EcoDrive GitHub repository.
2. Click the **Code** button.
3. Select **Download ZIP**.
4. Extract the downloaded ZIP file.
5. Open the extracted `EcoDrive` folder in Visual Studio Code.

### Step 2: Configure the Backend

Open the VS Code terminal and navigate to the backend directory:

```bash
cd backend
```

Install the backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

Add the following configuration:

```env
PORT=5050
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the placeholder values with your actual MongoDB and Cloudinary credentials.

**Important:** Never share your `.env` file or upload it to GitHub. It contains private credentials and secret keys.

Start the backend server:

```bash
npm run dev
```

If the project uses a different development script, check the `scripts` section in `backend/package.json` and run the appropriate command.

The backend should run on:

```text
http://localhost:5050
```

### Step 3: Configure the Frontend

Open a second terminal in VS Code.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

If the frontend uses an environment variable for the backend URL, create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5050
```

Use the exact environment variable name expected by your frontend API configuration.

Start the frontend development server:

```bash
npm run dev
```

### Step 4: Access the Application

After starting the frontend, Vite will display a local development URL in the terminal.

Usually, it is:

```text
http://localhost:5173
```

Open this URL in your web browser to access EcoDrive.

**Note:** Keep both the frontend and backend servers running while using the application. Ensure MongoDB and Cloudinary are configured correctly before testing database operations and certificate uploads.

---

## 7. How to Use EcoDrive

### Vehicle Owner

1. Open the EcoDrive application.
2. Register an account or log in.
3. Add your vehicle details.
4. Navigate to the Track section.
5. View your vehicle's PUC certificate status and expiry date.
6. View the uploaded certificate when available.
7. Contact an authorized PUC testing centre to obtain an updated certificate when required.

### PUC Updater

1. Log in using an authorized PUC updater account.
2. Access the certificate upload section.
3. Select the registered vehicle.
4. Enter the certificate details and test results.
5. Upload the PUC certificate.
6. Submit the information.

The system updates the latest certificate and resets the vehicle's previous police-caught status.

### Police

1. Log in using an authorized police account.
2. Navigate to the Overdue section.
3. View vehicles forwarded after the grace period.
4. Search for vehicles using their registration numbers.
5. Review the vehicle and certificate details.
6. Select the **Caught** button when taking the relevant enforcement action.
7. Confirm the action in the confirmation dialog.

After confirmation, the vehicle disappears from the Overdue list, and its owner can see the updated status on the Track page.

---

## 8. PUC Certificate Expiry Workflow

EcoDrive follows an automated certificate lifecycle:

```text
       PUC Certificate Uploaded
                  |
                  v
           Certificate Valid
                  |
                  v
             Expiring Soon
                  |
                  v
          Certificate Expires
                  |
                  v
          10-Day Grace Period
                  |
                  v
          Forwarded to Police
                  |
                  v
          Police Marks Caught
```

Uploading a new PUC certificate at any stage starts a fresh tracking cycle.

The latest uploaded certificate is considered when determining the vehicle's current PUC status.

---

## 9. Database Models

EcoDrive uses MongoDB to store and manage application data.

The main database models include:

### User

Stores user account information, authentication details, and role information.

### Vehicle

Stores vehicle details such as:

- Owner reference
- Registration number
- Vehicle type
- Manufacturer
- Model
- Fuel type
- Manufacturing year
- Police-caught status

### PUC Certificate

Stores certificate-related information, including:

- Vehicle reference
- Certificate number
- Test date
- Expiry date
- CO and HC test results
- Certificate file URL
- Uploaded-by information

---

## 10. Deployment

EcoDrive can be deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Certificate Storage | Cloudinary |
| Source Code | GitHub |

### Deployment Steps

1. Push the project source code to GitHub.
2. Deploy the frontend directory using Vercel.
3. Deploy the backend directory using Render.
4. Configure the backend environment variables on Render.
5. Configure the frontend API URL to point to the deployed backend.
6. Update backend CORS settings to allow requests from the deployed frontend domain.
7. Verify authentication, vehicle management, and certificate uploads.

---

## 11. Future Enhancements

- Automated email and SMS reminders for certificate renewals.
- Integration with government-authorized PUC databases.
- AI/ML-based prediction of potential vehicle pollution defects.
- Advanced analytics and pollution monitoring dashboards.
- Improved reporting and enforcement analytics.

---

## 12. Contributors

**Project Name:** EcoDrive – Smart Vehicle Pollution Control & PUC Management System

**Project Type:** Full-Stack Web Application

**Technology:** MERN Stack

Developed as an academic project to demonstrate full-stack web development, database management, authentication, REST API integration, and real-world workflow automation.

---

## 13. License

This project is developed for educational and demonstration purposes.