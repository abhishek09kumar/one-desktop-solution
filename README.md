# One Desktop Solution

A modern, offline-first Point-of-Sale (POS) and Inventory Management desktop application built with Electron, React, SQLite, and Node.js. The app enables you to manage products, handle billing, process returns, and synchronize data with a cloud server—both manually and automatically.

---

## Features

- **Offline-First:** All operations work without internet. Data syncs to the cloud when available.
- **Inventory Management:** Add, edit, delete, and view products. Expiry alerts for products expiring in the next 30 days.
- **Billing:** Search products, build orders, validate stock, process payments, and print invoices.
- **Returns:** Handle product returns and update inventory accordingly.
- **Cloud Sync:** Sync data with a cloud server via REST API, manually or on a daily schedule.
- **Modern UI:** Built with React and Tailwind CSS for a clean, responsive experience.
- **Notifications:** Alerts for expiring products.
- **Secure:** Electron context isolation and no direct DB access from the browser.


---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhishek09kumar/one-desktop-solution.git
   cd one-desktop-solution
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd renderer
   npm install
   cd ..
   ```

3. **Run database migrations:**
   ```bash
   node db/migrate.js
   ```

4. **Start the app (development mode):**
   ```bash
   npm run dev
   ```

---

## Building for Production

1. **Build the React frontend:**
   ```bash
   cd renderer
   npm run build
   cd ..
   ```

2. **Build the Electron app (installer):**
   ```bash
   npm run build
   ```
   The installer/executable will be in the `dist/` folder.

---

## Cloud Sync API

- The app syncs data to a cloud Express.js server.
- Endpoints:
  - `POST /sync/products`
  - `POST /sync/sales`
  - `POST /sync/returns`

See `cloud/server.js` for implementation details.

---

## Project Structure

```
one-desktop-solution/
├── db/                # SQLite DB, migrations, and scripts
├── cloud/             # Cloud sync API and sync scripts
├── renderer/          # React frontend (UI)
├── main.js            # Electron main process
├── preload.js         # Electron preload script
├── package.json       # Project config and scripts
└── ...
```

---

## Scripts

- `npm run dev` — Start the app in development mode
- `npm run electron` — Start Electron only
- `npm run cloud:sync` — Manually sync data to the cloud
- `npm run build` — Build the app for production (installer)

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[ISC](LICENSE)

---

## Author

Abhishek Kumar

---

## Acknowledgements

- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [SQLite](https://www.sqlite.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)

## Result



![Screenshot 2025-04-30 221106](https://github.com/user-attachments/assets/8ccf1355-ee79-4a4f-91d3-8573737f5ada)

![Screenshot 2025-04-30 221235](https://github.com/user-attachments/assets/c34d0e76-fec5-44bd-8d5c-3eb105ba073c)

![Screenshot 2025-04-30 221259](https://github.com/user-attachments/assets/9985b8f7-2914-405f-9104-4879d08bbd45)

![Screenshot 2025-04-30 221329](https://github.com/user-attachments/assets/7eb6ca9c-5a7d-4c26-be21-6acda46807cb)

![Screenshot 2025-04-30 221358](https://github.com/user-attachments/assets/d4527b01-911c-459a-8917-89eb00cfae2e)

![Screenshot 2025-04-30 221409](https://github.com/user-attachments/assets/ede5163b-0506-4a01-bab5-337fd2f81312)

![Screenshot 2025-04-30 221445](https://github.com/user-attachments/assets/c64ce407-b105-41f8-8782-be6d03e319e6)

![Screenshot 2025-04-30 221509](https://github.com/user-attachments/assets/136d2511-3416-47e8-9e91-eeb71028340a)

![Screenshot 2025-04-30 221613](https://github.com/user-attachments/assets/8fe632c8-6989-4bdb-af64-74a33833e85c)
