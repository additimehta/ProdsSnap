# ProdsSnap

**ProdSnap** is a product management tool that tracks product updates and stores version histories — like GitHub, but for products.  
It helps teams manage changes, revert to previous versions, and analyze product trends to make better decisions.

---

## ✨ Features

- **Product Management**: Create, edit, and delete products easily.
- **Version History**: Track every update made to a product over time.
- **Version Revert**: Restore a product to any previous version with a single click.
- **Analytics**: AI-powered price suggestions and product quality feedback (coming soon).

---

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Go (Golang) with Gin
- **Database**: MongoDB
- **Styling**: TailwindCSS
- **Routing**: React Router

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Go (v1.20 or higher)
- MongoDB

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/prodsnap.git
cd prodsnap

cd backend
go mod tidy
go run .

cd frontend
npm install
npm run dev
