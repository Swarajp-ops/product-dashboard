A responsive product management dashboard built with React, Vite, Tailwind CSS v4, Axios, and the free DummyJSON API.

The project was created for a frontend assignment. It demonstrates authentication, protected routes, product browsing, URL-based state, pagination, search, filters, sorting, product details, and simulated product CRUD actions.

Live Demo
Live application: https://product-dashboard-umber-six.vercel.app/products?page=1

GitHub repository: https://github.com/Swarajp-ops/product-dashboard.git

Tech Stack
React.js with Vite

Tailwind CSS v4 using @tailwindcss/vite

React Router DOM

Axios

DummyJSON REST API

Oxlint

Features Completed
Authentication
Login using DummyJSON authentication API.

Test credentials:

text

Username: emilys
Password: emilyspass
Displays an error message for incorrect login details.

Stores the login token locally.

Sends the login token automatically with Axios request interceptors.

Protects product pages from unauthenticated users.

Redirects logged-out users to the login page.

Includes a logout button.

Prevents multiple login requests while a login request is already in progress.

Product List
Displays products with image, title, category, price, rating, and stock.

Uses a table layout on desktop screens.

Uses product cards on mobile screens.

Shows loading UI while product data is loading.

Shows an empty state when there are no products.

Shows an error message and Retry button if an API request fails.

Pagination
Uses DummyJSON limit and skip query parameters for server-side pagination.

Includes Previous and Next navigation.

Includes page-number buttons.

Supports page sizes of 10, 20, and 50 products.

Displays result information such as Showing 21–40 of 194.

Safely handles invalid URL values such as ?page=abc.

Prevents the page from breaking for out-of-range page values.

Search, Filter, and Sort
Searches products through the /products/search?q= endpoint.

Debounces search input so API calls happen only after the user stops typing.

Resets pagination to page 1 after changing the search value.

Filters products by category using categories from /products/categories.

Sorts products by price, rating, or title.

Keeps page, page size, search, category, and sort values in the URL.

Supports refreshing or sharing a URL while preserving the current view.

Prevents old delayed API responses from replacing newer search results.

Product Details
Shows a product details page at /products/:id.

Displays product images, description, price, rating, stock, and reviews.

Displays a friendly product-not-found state for an invalid product ID.

Add, Edit, and Delete
Adds products using the DummyJSON simulated add endpoint.

Edits products using the DummyJSON simulated update endpoint.

Deletes products using the DummyJSON simulated delete endpoint.

Validates required fields and non-negative price/stock values.

Shows a confirmation dialog before deletion.

Prevents multiple Save requests while a save request is active.

Updates the UI after simulated changes.

Code Quality
Uses one shared Axios configuration file.

Keeps API calls in dedicated api files instead of UI components.

Uses small reusable components.

Uses Oxlint for linting.

Project Structure
text

src/
├── api/
│   ├── axios.js          # Shared Axios instance and interceptors
│   ├── authApi.js        # Login API call
│   └── productApi.js     # Product API calls
├── components/
│   ├── ErrorState.jsx
│   ├── Layout.jsx
│   ├── Loading.jsx
│   ├── Pagination.jsx
│   ├── ProductCard.jsx
│   ├── ProductForm.jsx
│   └── ProductTable.jsx
├── context/
│   └── AuthContext.jsx   # Login/logout state
├── pages/
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── ProductDetails.jsx
│   └── Products.jsx
├── App.jsx
├── index.css
└── main.jsx
Setup Steps
Prerequisites
Install the following before running the project:

Node.js 18 or newer

npm

Git, if you want to clone the repository

Check your installed versions:

bash

node -v
npm -v
git --version
Clone the repository
bash

git clone https://github.com/Swarajp-ops/product-admin-dashboard.git
cd product-admin-dashboard
If you downloaded the code as a ZIP file instead, extract it and open the product-admin-dashboard folder in a terminal.

Install dependencies
bash

npm install
Start the development server
bash

npm run dev
Open the local URL displayed in the terminal, normally:

text

http://localhost:5173
Run linting
bash

npm run lint
To automatically fix supported lint issues:

bash

npm run lint:fix
Create a production build
bash

npm run build
Preview the production build locally:

bash

npm run preview
Environment Variables
No environment variables are required because this project uses the public DummyJSON API:

text

https://dummyjson.com
Do not commit .env files if you later add private environment variables.

Key Implementation Choices
Shared Axios client
All API calls use Axios. The shared Axios instance is in src/api/axios.js and is responsible for:

Setting the DummyJSON base URL.

Adding the stored authentication token to requests.

Converting API errors into consistent messages.

This keeps authentication and error-handling logic out of page components.

URL state
The product listing keeps its state in URL query parameters, for example:

text

/products?page=2&limit=20&search=phone&category=beauty&sort=price-desc
This means browser refresh, browser navigation, and shared links preserve the page state.

Search and category behavior
DummyJSON has separate endpoints for searching all products and listing products within a category. It does not provide a single endpoint that searches and filters by category together.

This project gives search priority when a search term exists. When the user searches, the app calls:

text

/products/search?q=search-term
When there is no search term but a category is selected, the app calls:

text

/products/category/category-name
This is explicitly documented instead of pretending the API supports simultaneous server-side search and category filtering.

Preventing stale search results
A debounced search waits briefly after the user stops typing before making an API call. Each request receives an incrementing request ID. A response can update the UI only when its request ID matches the newest request ID.

This prevents a slow, older request from overwriting the results from a newer search.

Simulated CRUD behavior
DummyJSON accepts add, update, and delete requests but does not permanently save those changes on its server.

The application still reflects changes in the current UI session:

Add and edit actions refresh or update the visible product data.

Delete removes the product from the current local list immediately.

In a production application, these requests would be sent to a real database-backed backend.

Problem Faced and Solution
Problem: Older search results could overwrite newer results
When a user types quickly, multiple delayed search requests may be in progress at the same time. A slower old response could arrive after a newer response and show incorrect results.

Solution
The application uses both:

A debounce timer to reduce unnecessary API calls.

A request ID check so only the newest response is allowed to update component state.

This keeps the product list matched with the latest search input even when API responses are delayed.

AI Tool Usage
AI tools were used as a learning and productivity aid for planning the component structure, reviewing implementation approaches, generating initial code examples, and explaining concepts such as Axios interceptors, Tailwind setup, routing, and Git workflows.

All generated code was reviewed, understood, tested, and adapted for this project. The final implementation and project decisions were verified manually.

Assignment Checklist

React.js implementation


Tailwind CSS styling


Axios for every API request


Login and logout


Protected product routes


Responsive table and card layouts


Server-side pagination


Debounced search


Category filtering and sorting


URL query state


Product details page


Invalid product handling


Add, edit, and delete flows


Validation and confirmation dialog


Loading, empty, and error states


Retry mechanism


Race-condition protection for search


Shared Axios setup


Oxlint setup


README documentation


