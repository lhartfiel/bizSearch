## BizSearch

BizSearch is a web application that allows users to search for businesses by name/type and location. Results are aggregated from both the Google Places API and the Foursquare API for comprehensive coverage.

---

### 🚀 Tech Stack

- **TanStack Start Framework** (React-based)
- **TypeScript**
- **Tailwind CSS** for styling
- **Vite** for fast development and builds
- **TanStack Query** for data fetching and caching
- **TanStack Form** for form management
- **React Testing Library** & **Vitest** for testing

---

### 📦 Getting Started

#### 1. Install Dependencies

```sh
npm install
```

#### 2. Environment Variables

Create a `.env.local` file in the project root with your API keys:

```env
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
VITE_FOURSQUARE_API_KEY=your_foursquare_api_key
```

#### 3. Run the Development Server

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 📝 Usage

1. **Enter a business name/type** (e.g., "Coffee", "Dunkin Donuts").
2. **Enter a location** (e.g., "Chicago, IL").
3. Click **Scout** to search.
4. Results will display cards with business details from both APIs.
5. Use **Load More** to fetch additional results if available.

---

### 🧪 Testing

Run unit and integration tests using Vitest:

```sh
npm run test
```

Tests are written with React Testing Library and cover components, forms, and API logic.

---

### 🗂️ Project Structure

```
src/
  api/                # API fetch logic
  components/         # Reusable React components
  helpers/            # Utility functions and constants
  pages/              # Route components
  styles/             # Tailwind and custom styles
  tests/              # Test files
```

---

### ⚙️ Configuration & Customization

- **API Keys:** You must provide your own Google Places and Foursquare API keys.
- **Styling:** Tailwind CSS is used for rapid UI development.
- **Environment:** Vite handles hot module reloading and fast builds.

---

### ❓ Troubleshooting

- If you see API errors, check your `.env.local` for correct keys.
- For CORS issues, ensure your API keys are enabled for localhost.
- For test failures, ensure all dependencies are installed and up to date.

---

### 📄 License

MIT

---
