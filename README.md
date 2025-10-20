# ShopEasy - Modern E-commerce Platform

A full-stack e-commerce website built with React, Express.js, and MongoDB. Features a modern, responsive design with comprehensive e-commerce functionality.

## 🚀 Features

### Frontend (React)
- **Modern UI/UX**: Built with Material-UI for a professional look
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Product Catalog**: Browse products with filtering, sorting, and search
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **User Authentication**: Login, register, and profile management
- **Order Management**: Checkout process, order history, order tracking
- **Admin Dashboard**: Manage orders, products, and users
- **Product Reviews**: Rate and review products
- **Real-time Updates**: Redux state management for smooth UX

### Backend (Express.js)
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error handling
- **Security**: CORS, rate limiting, and secure headers

### Database Models
- **Users**: Customer and admin user management
- **Products**: Product catalog with categories, reviews, and inventory
- **Orders**: Order processing and tracking
- **Reviews**: Product rating and review system

## 🛠️ Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- Redux Toolkit
- React Router
- React Hook Form
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Express Validator

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the application**
   
   **Development mode (both frontend and backend):**
   ```bash
   npm run dev
   ```
   
   **Or run separately:**
   
   Backend only:
   ```bash
   npm run server
   ```
   
   Frontend only:
   ```bash
   npm run client
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 Usage

### For Customers
1. **Browse Products**: Visit the homepage or products page to see available items
2. **Search & Filter**: Use the search bar and filters to find specific products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Create Account**: Register for an account to place orders
5. **Checkout**: Review your cart and proceed to checkout
6. **Track Orders**: View your order history in your profile

### For Administrators
1. **Admin Access**: Create an admin account or promote a user to admin
2. **Dashboard**: Access the admin dashboard at `/admin`
3. **Manage Orders**: View and update order statuses
4. **Product Management**: Add, edit, or remove products
5. **User Management**: View and manage user accounts

## 📁 Project Structure

```
ecommerce/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   └── App.js
│   └── package.json
├── models/                # MongoDB models
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/                # API routes
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── users.js
├── middleware/            # Custom middleware
│   └── auth.js
├── server.js             # Express server
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order payment
- `GET /api/orders/admin/all` - Get all orders (admin)

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## 🎨 Customization

### Adding New Product Categories
1. Update the category enum in `models/Product.js`
2. Add the category to the frontend filter options
3. Update the category navigation in the footer

### Styling
- The app uses Material-UI theming
- Customize colors and typography in `client/src/App.js`
- Add custom CSS in `client/src/index.css`

### Adding New Features
1. Create new API routes in the `routes/` directory
2. Add corresponding Redux slices in `client/src/store/slices/`
3. Create new components in `client/src/components/`
4. Add new pages in `client/src/pages/`

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Deploy the main branch

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `client/build` folder
3. Set environment variables for API URL

### Database
- Use MongoDB Atlas for cloud database
- Update `MONGODB_URI` in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔮 Future Enhancements

- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Coupon system

---

**Happy Shopping! 🛒**
