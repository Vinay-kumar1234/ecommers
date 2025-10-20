import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Rating,
  Paper,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  FilterList,
  Sort,
  Search,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setFilters, clearFilters, setCurrentPage } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { products, filters, pagination, isLoading, categories, brands } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    // Initialize filters from URL params
    const urlFilters = {
      category: searchParams.get('category') || 'all',
      brand: searchParams.get('brand') || 'all',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };
    
    dispatch(setFilters(urlFilters));
  }, [searchParams, dispatch]);

  useEffect(() => {
    // Fetch products when filters change
    const fetchParams = {
      ...filters,
      page: pagination.currentPage,
      limit: 12,
    };
    
    dispatch(fetchProducts(fetchParams));
  }, [filters, pagination.currentPage, dispatch]);

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    dispatch(setFilters(newFilters));
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== '') {
      newSearchParams.set(filterName, value);
    } else {
      newSearchParams.delete(filterName);
    }
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (event, page) => {
    dispatch(setCurrentPage(page));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
  };

  const FilterSidebar = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Filters</Typography>
        <Button size="small" onClick={handleClearFilters}>
          Clear All
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        label="Search products"
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Category Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category}
          label="Category"
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Brand Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Brand</InputLabel>
        <Select
          value={filters.brand}
          label="Brand"
          onChange={(e) => handleFilterChange('brand', e.target.value)}
        >
          <MenuItem value="all">All Brands</MenuItem>
          {brands.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Typography variant="subtitle2" gutterBottom>
        Price Range
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          label="Min"
          type="number"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          size="small"
        />
        <TextField
          label="Max"
          type="number"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          size="small"
        />
      </Box>

      {/* Sort */}
      <FormControl fullWidth>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          label="Sort By"
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            handleFilterChange('sortBy', sortBy);
            handleFilterChange('sortOrder', sortOrder);
          }}
        >
          <MenuItem value="createdAt-desc">Newest First</MenuItem>
          <MenuItem value="createdAt-asc">Oldest First</MenuItem>
          <MenuItem value="price-asc">Price: Low to High</MenuItem>
          <MenuItem value="price-desc">Price: High to Low</MenuItem>
          <MenuItem value="rating-desc">Highest Rated</MenuItem>
          <MenuItem value="name-asc">Name: A to Z</MenuItem>
          <MenuItem value="name-desc">Name: Z to A</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setMobileFilterOpen(true)}>
            <FilterList />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={1}>
              <FilterSidebar />
            </Paper>
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography>Loading products...</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {products.length} of {pagination.totalProducts} products
                </Typography>
                {!isMobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Sort fontSize="small" />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(e) => {
                          const [sortBy, sortOrder] = e.target.value.split('-');
                          handleFilterChange('sortBy', sortBy);
                          handleFilterChange('sortOrder', sortOrder);
                        }}
                      >
                        <MenuItem value="createdAt-desc">Newest First</MenuItem>
                        <MenuItem value="createdAt-asc">Oldest First</MenuItem>
                        <MenuItem value="price-asc">Price: Low to High</MenuItem>
                        <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        <MenuItem value="rating-desc">Highest Rated</MenuItem>
                        <MenuItem value="name-asc">Name: A to Z</MenuItem>
                        <MenuItem value="name-desc">Name: Z to A</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} key={product._id}>
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 280 } }}
      >
        <FilterSidebar />
      </Drawer>
    </Container>
  );
};

export default ProductListPage;
