# 🚀 Local Business Management System (LBMS)

A full-stack, production-ready SaaS platform designed for local shop owners to manage billing, products, customers, and business analytics — all in one place.

This system combines a smart POS (Point of Sale), real-time dashboard, and AI-powered insights to help businesses grow faster and smarter.

---

## 📌 Key Features

### 🛒 Product Management

* Add, update, and delete products
* Category & stock management
* Real-time stock updates after billing
* Low stock alerts

---

### 👤 Customer Management

* Capture customer details during billing
* Automatic customer data storage
* Customer purchase history tracking

---

### 💳 Smart Billing System (POS)

* Add products via click or search
* Quantity control with auto price calculation
* Discount support
* GST-based tax calculation
* Generate invoices with date & time
* Download & print invoice (PDF)

---

### 📊 Real-Time Dashboard

* Daily & monthly sales overview
* Revenue & profit analytics (charts)
* Top-selling products
* Business insights

---

### 🤖 AI Analytics (Python Microservice)

* Sales trend prediction
* Product demand analysis
* Dead stock detection
* Customer retention insights

---

### 🔔 Notification System

* Low stock alerts
* Daily sales summary
* In-app notifications dashboard
* Email notifications (SMTP)

---

### 👥 Role-Based Access (RBAC)

* Admin & Staff roles
* Secure API access using JWT
* Restricted UI based on roles

---

### 🔐 Security Features

* JWT Authentication
* Refresh tokens
* Input validation
* Rate limiting
* Audit logs (user activity tracking)

---

### 🧠 Smart Features

* Barcode scanner (camera-based)
* Voice-based billing (AI)
* Smart product search (fuzzy search)

---

### 🌐 Landing Page

* Modern responsive UI
* Features & pricing section
* Demo access

---

### 🧩 Integrations

* Excel export
* WhatsApp bill sharing (planned)
* Cloud storage support via AWS S3

---

## 🛠️ Tech Stack

### Frontend

* ReactJS
* Tailwind CSS
* Axios
* Recharts

### Backend

* Spring Boot (Java)
* REST APIs
* JWT Authentication
* WebSocket

### Database

* MySQL

### AI / Analytics

* Python (FastAPI)
* Pandas
* Scikit-learn

---

## 📁 Project Structure

```
project-root/
│
├── frontend/        # React Application
├── backend/         # Spring Boot API
├── ai-service/      # Python AI Microservice
├── database/        # SQL Schema
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ritikjagnit/local-business-management-system.git
cd local-business-management-system
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 3️⃣ Backend Setup (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

---

### 4️⃣ Database Setup (MySQL)

```sql
CREATE DATABASE business_db;
```

Update `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/business_db
spring.datasource.username=root
spring.datasource.password=your_password
```

---

### 5️⃣ AI Service Setup (Optional)

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🔄 API Endpoints (Sample)

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | /products      | Get all products   |
| POST   | /products      | Add new product    |
| POST   | /billing       | Create new bill    |
| GET    | /dashboard     | Get analytics data |
| GET    | /notifications | Get notifications  |

---

## 🚀 Future Enhancements

* Multi-shop SaaS support
* Payment gateway integration
* Mobile app (React Native)
* Advanced AI forecasting
* WhatsApp automation

---

## ⚠️ Important Notes

* Do NOT upload `.env` files
* Keep API keys secure
* Use proper Git commits
* Follow clean architecture

---

## 👨‍💻 Author

**Ritik Jagnit**
Passionate Software Developer
Focused on building scalable real-world systems

---

## ⭐ Support

If you like this project:

* Star ⭐ the repository
* Share it with others
* Contribute improvements

---

## 📜 License

This project is licensed under the MIT License.
