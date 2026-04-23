## Western Bite Restaurant - Admin and Web Interface

**Web Technologies 2 Assignment**

This project was developed for an American-style restaurant and consists of two parts:
- **Admin interface** (Angular + Material) – for managing products, users, weekly menus, contact forms, and reservations.
- **Public Website** (HTML/CSS/JS + jQuery) – displaying the restaurant’s menu and weekly specials, along with contact and table reservation forms.

The backend uses **Express.js** + **MongoDB**, with communication via REST API.

---

## Tech stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- **Admin frontend**: Angular 15+, Angular Material
- **Public frontend**: HTML5, CSS3, JavaScript, jQuery, Bootstrap

---

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- Angular CLI (`npm install -g @angular/cli`)

---

## Installation

1. Clone the repo, then navigate to the directory.
2. Install the dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## Database Setup

**Start MongoDB**:

```bash
mongod
```

**Uploading seed data** (categories, products, admin user, weekly menu):

```bash
cd backend
node scripts/seed.js
```

---

## Starting the applications

### 1. Backend (API)

```bash
cd backend
npm run dev
```
The backend is available at: `http://localhost:5000`

### 2. Admin interface (Angular)

```bash
cd frontend
ng serve --proxy-config proxy.conf.json
```
Admin interface: `http://localhost:4200`

### 3. Public website

```bash
cd site
npx live-server --port=5500
```
Website: `http://localhost:5500`

> The public site uses the `http://localhost:5000` backend address. If the backend is running at a different address, modify the `BACKEND_URL` value in the `site/js/layout.js` file.

---

## Usage

- **Admin interface**: Manage products, users, and weekly menus; view a list of received messages and reservations.
- **Public site**: Browse the menu, view the weekly menu, contact us, and make a table reservation.