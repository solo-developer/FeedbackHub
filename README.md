# FeedbackHub

**FeedbackHub** is a full-stack web application designed to streamline the process of collecting, managing, and tracking client feedback, including bugs, feature requests, and general issues. It bridges communication between clients and vendors to ensure feedback is properly logged, tracked, and resolved.

---

## 🚀 Features

- ✅ Submit, track, and manage client feedback
- 🔐 Secure login system for clients and vendors
- 🎯 Role-based access control
- 🔗 Link related feedbacks (no duplicates or self-linking)
- 📁 Export feedbacks to Excel with column selection
- 🕓 View detailed feedback history and revisions

---

## ⚙️ Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js (LTS)](https://nodejs.org/)
- SQL Server instance

### Backend Setup

```bash
cd FeedbackHub.Server
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend Setup

```bash
cd feedbackhub.client
npm install
npm start
```
## 🙌 Contributing

We welcome contributions from the community!

To contribute:

1. **Fork** the repository.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/solo-developer/FeedbackHub.git
3. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes,commit and push**:
   ```bash
   git commit -m "Add your feature"
   git push origin feature/your-feature-name
   ```
5. **Open a pull request** describing your changes:

## 📄 License

This project is licensed under the **MIT License**.  
See the License file for details.


