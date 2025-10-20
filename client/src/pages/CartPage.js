import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  TextField,
  Divider,
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { items, totalItems, totalPrice } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * 0.1; // 10% tax
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Cart Items
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
          </Box>

          {items.map((item) => (
            <Card key={item.product._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3} md={2}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={item.product.images[0]?.url || '/api/placeholder/200/200'}
                      alt={item.product.name}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/products/${item.product._id}`)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={9} md={10}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.product.brand}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ${item.product.price}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.product._id, newQuantity);
                            }}
                            inputProps={{ min: 1, max: item.product.stock }}
                            size="small"
                            sx={{ width: 60 }}
                            type="number"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Max: {item.product.stock}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <Typography variant="h6" textAlign="right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.product._id)}
                          sx={{ ml: 'auto' }}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </Typography>
                <Typography variant="body2">
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Shipping
                </Typography>
                <Typography variant="body2">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Tax
                </Typography>
                <Typography variant="body2">
                  ${tax.toFixed(2)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                  Total
                </Typography>
                <Typography variant="h6" color="primary">
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {totalPrice < 100 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
