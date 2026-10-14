**StyleHive — Fashion E-commerce Website**

StyleHive is a full-stack fashion e-commerce application where visitors can explore products without creating an account. Customers need to sign up or log in before using shopping features such as adding items to the cart, placing orders, submitting reviews, or requesting returns.
Live Project
**- Live Website:** style-hive-six.vercel.app/
**- Backend API:** https://style-hive-backend-fo6eohz2f-stylehive.vercel.app
**- GitHub Repository:** https://github.com/Saira-akhtar/StyleHive
  
**Features**
Browse Without an Account
- Browse available products as a guest.
- View product details and images.
- Explore the store before creating an account.
  
**Customer Account Required**

Customers must sign up or log in to:
- Add products to the shopping cart.
- View and manage their cart.
- Proceed to checkout and place orders.
- View their own order history and order status.
- Submit product reviews.
- Request a return for an eligible order.
- Manage supported profile information.
  
**Guest and Customer Access**
Action	Guest	Signed-in customer
Browse products	Allowed	Allowed
View product details	Allowed	Allowed
Add items to cart	Sign-up or login required	Allowed
Place an order	Sign-up or login required	Allowed
Submit a review	Sign-up or login required	Allowed
Request a return	Sign-up or login required	Allowed for eligible orders
View personal order history	Sign-up or login required	Allowed
View another customer's private order	Not allowed	Not allowed


When a guest selects a protected action, the website should prompt them to sign up or log in. After authentication, they should be able to continue shopping.
**Customer Shopping Flow**
1. A visitor opens StyleHive and browses products.
2. The visitor opens a product detail page.
3. When the visitor selects Add to Cart, the site asks them to sign up or log in.
4. After logging in, the customer can add items to the cart and update quantities.
5. The customer proceeds to checkout and places an order.
6. The customer can view their own orders and order status.
7. The customer can submit product reviews and request returns for eligible orders.
8. The customer can check the status of a return request when return-status tracking is available.
**Technology Stack**

**Frontend**
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Icons, where used
**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT) authentication, where configured
- bcrypt password hashing, where configured
- Cloudinary and Multer for image uploads, where configured
**API Notes**
The deployed backend API base URL is:

The product endpoint used by this project is /product under the API base URL. Check the actual backend routes before changing endpoint names.
Security and Access Rules
- Product browsing should be available without signing in.
- Cart, checkout, order, review, and return-request actions should require customer authentication.
- The backend should verify authentication for protected requests; hiding frontend buttons alone is not sufficient.
- Customers should only be able to access their own carts, orders, reviews where applicable, and return requests.
- Passwords should be stored as secure hashes.
- Private credentials and API secrets should be kept in deployment settings and must not be published in this README or committed to the repository.
Return Requests
A return request should be accepted only from an authenticated customer who owns the relevant order and meets the store's return policy. Depending on the implementation, a request may include the order item, reason, notes, submission date, and status.
Project Structure

The frontend is located in Client/client.

StyleHive/
├── Client/
│   └── client/       # React + Vite frontend
├── backend/          # Example name for the Express API folder
├── README.md
└── .gitignore

