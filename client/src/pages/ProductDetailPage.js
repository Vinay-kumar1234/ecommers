import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Rating,
  Chip,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  ImageList,
  ImageListItem,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  LocalShipping,
  Security,
  Support,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, addProductReview } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useForm } from 'react-hook-form';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { currentProduct, isLoading, error } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ product: currentProduct, quantity }));
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleReviewSubmit = (data) => {
    dispatch(addProductReview({
      productId: id,
      reviewData: data
    }));
    reset();
    setShowReviewForm(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !currentProduct) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Product not found'}
        </Alert>
      </Container>
    );
  }

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <img
              src={currentProduct.images[selectedImage]?.url || '/api/placeholder/500/500'}
              alt={currentProduct.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </Box>
          {currentProduct.images.length > 1 && (
            <ImageList cols={4} rowHeight={100} sx={{ maxHeight: 400 }}>
              {currentProduct.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img
                    src={image.url}
                    alt={`${currentProduct.name} ${index + 1}`}
                    loading="lazy"
                    style={{
                      cursor: 'pointer',
                      opacity: selectedImage === index ? 1 : 0.7,
                      border: selectedImage === index ? '2px solid #1976d2' : 'none',
                      borderRadius: '4px',
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {currentProduct.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {currentProduct.brand}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={currentProduct.rating} readOnly precision={0.1} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({currentProduct.numReviews} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary">
                ${currentProduct.price}
              </Typography>
              {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                <>
                  <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    ${currentProduct.originalPrice}
                  </Typography>
                  <Chip
                    label={`${currentProduct.discountPercentage}% OFF`}
                    color="secondary"
                    size="small"
                  />
                </>
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentProduct.description}
            </Typography>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              {currentProduct.stock > 0 ? (
                <Chip
                  label={`In Stock (${currentProduct.stock} available)`}
                  color="success"
                  variant="outlined"
                />
              ) : (
                <Chip
                  label="Out of Stock"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Quantity and Actions */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="subtitle1">Quantity:</Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: currentProduct.stock }}
                  size="small"
                  sx={{ width: 80 }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0}
                  sx={{ flexGrow: 1, minWidth: 200 }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleBuyNow}
                  disabled={currentProduct.stock === 0}
                  sx={{ flexGrow: 1, minWidth: 200 }}
                >
                  Buy Now
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Favorite />}
                  size="small"
                >
                  Wishlist
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  size="small"
                >
                  Share
                </Button>
              </Box>
            </Box>

            {/* Features */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalShipping fontSize="small" color="primary" />
                <Typography variant="body2">Free shipping on orders over $100</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Security fontSize="small" color="primary" />
                <Typography variant="body2">Secure payment processing</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Support fontSize="small" color="primary" />
                <Typography variant="body2">24/7 customer support</Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs">
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Reviews" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1">
            {currentProduct.description}
          </Typography>
          {currentProduct.features && currentProduct.features.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Features:
              </Typography>
              <List>
                {currentProduct.features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`• ${feature}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {currentProduct.specifications ? (
            <Box>
              {Object.entries(currentProduct.specifications).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', py: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="subtitle2" sx={{ minWidth: 150, fontWeight: 'bold' }}>
                    {key}:
                  </Typography>
                  <Typography variant="body2">{value}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No specifications available for this product.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Reviews ({currentProduct.numReviews})
            </Typography>
            
            {isAuthenticated && (
              <Button
                variant="outlined"
                onClick={() => setShowReviewForm(!showReviewForm)}
                sx={{ mb: 2 }}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </Button>
            )}

            {showReviewForm && (
              <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                <form onSubmit={handleSubmit(handleReviewSubmit)}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Rating *
                    </Typography>
                    <Rating
                      {...register('rating', { required: 'Rating is required' })}
                      precision={1}
                    />
                    {errors.rating && (
                      <Typography variant="caption" color="error">
                        {errors.rating.message}
                      </Typography>
                    )}
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    {...register('comment', { 
                      required: 'Comment is required',
                      minLength: { value: 10, message: 'Comment must be at least 10 characters' }
                    })}
                    error={!!errors.comment}
                    helperText={errors.comment?.message}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained">
                      Submit Review
                    </Button>
                    <Button onClick={() => setShowReviewForm(false)}>
                      Cancel
                    </Button>
                  </Box>
                </form>
              </Paper>
            )}

            {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
              <Box>
                {currentProduct.reviews.map((review, index) => (
                  <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {review.name}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews yet. Be the first to review this product!
              </Typography>
            )}
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
