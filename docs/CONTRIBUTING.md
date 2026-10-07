# Contributing to ForgeX

Thank you for your interest in contributing to **ForgeX — The AI-Native Software Engineering & DevSecOps Platform**!

---

## 1. Development Prerequisites

- **Java**: JDK 21+
- **Build Tool**: Apache Maven 3.9+
- **Python**: Python 3.11+
- **Node.js**: Node 20+ and npm 10+
- **Containerization**: Docker & Docker Compose

---

## 2. Local Setup Guide

```bash
# 1. Clone repository
git clone https://github.com/nellipatlareddyramcharan1316-cyber/Forgex.git
cd Forgex

# 2. Run backend
cd backend
mvn spring-boot:run

# 3. Run AI microservice (in another terminal)
cd ../ai-service
pip install -r requirements.txt
python -m uvicorn main:app --port 8000 --reload

# 4. Run frontend UI (in another terminal)
cd ../frontend
npm install
npm run dev
```

---

## 3. Contribution Guidelines

1. **AI Safety Rule**: All automated code modifications must branch to `feature/*`. Never push directly to `main`.
2. **Quality Gate**: Code changes must achieve a **ForgeX Trust Score >= 90/100** before merging.
3. **Tests**: Add unit and integration tests for every new REST endpoint and AI capability.
