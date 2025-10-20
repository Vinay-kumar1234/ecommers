import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Rating,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  Star,
  LocalShipping,
  Security,
  Support,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { products, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch featured products (first 8 products)
    dispatch(fetchProducts({ limit: 8, sortBy: 'rating', sortOrder: 'desc' }));
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const features = [
    {
      icon: <LocalShipping fontSize="large" />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $100',
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Secure Payment',
      description: 'Your payment information is safe and secure',
    },
    {
      icon: <Support fontSize="large" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support',
    },
    {
      icon: <TrendingUp fontSize="large" />,
      title: 'Best Prices',
      description: 'Competitive prices on all products',
    },
  ];

  const categories = [
    { name: 'Electronics', image: '/api/placeholder/300/200', path: '/products?category=electronics' },
    { name: 'Clothing', image: '/api/placeholder/300/200', path: '/products?category=clothing' },
    { name: 'Home & Garden', image: '/api/placeholder/300/200', path: '/products?category=home' },
    { name: 'Books', image: '/api/placeholder/300/200', path: '/products?category=books' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Welcome to ShopEasy
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}
          >
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, reliable delivery.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5,
              }}
            >
              Shop Now
            </Button>
            {!isAuthenticated && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Create Account
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Why Choose ShopEasy?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            Shop by Category
          </Typography>
          <Grid container spacing={4}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                  onClick={() => navigate(category.path)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" textAlign="center">
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            Featured Products
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            endIcon={<TrendingUp />}
          >
            View All
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Loading featured products...</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {products.slice(0, 8).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images[0]?.url || '/api/placeholder/300/200'}
                    alt={product.name}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${product._id}`)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.brand}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({product.numReviews})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6" color="primary">
                        ${product.price}
                      </Typography>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          ${product.originalPrice}
                        </Typography>
                      )}
                      {product.discountPercentage > 0 && (
                        <Chip
                          label={`${product.discountPercentage}% OFF`}
                          color="secondary"
                          size="small"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
