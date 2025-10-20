import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders, setCurrentPage } from '../store/slices/orderSlice';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orders, pagination, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders({ page: pagination.currentPage, limit: 10 }));
  }, [dispatch, pagination.currentPage]);

  const handlePageChange = (event, page) => {
    dispatch(setCurrentPage(page));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Order History
      </Typography>

      {orders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't placed any orders yet. Start shopping to see your orders here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {orders.map((order) => (
            <Card key={order._id} sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" gutterBottom>
                      {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                    </Typography>
                    {order.orderItems.slice(0, 2).map((item, index) => (
                      <Typography key={index} variant="body2" color="text.secondary">
                        {item.name} x {item.quantity}
                      </Typography>
                    ))}
                    {order.orderItems.length > 2 && (
                      <Typography variant="body2" color="text.secondary">
                        +{order.orderItems.length - 2} more items
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="h6" color="primary">
                      ${order.totalPrice.toFixed(2)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      View
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment: {order.isPaid ? 'Paid' : 'Pending'}
                    </Typography>
                    {order.isPaid && order.paidAt && (
                      <Typography variant="caption" color="text.secondary">
                        Paid on {formatDate(order.paidAt)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Delivery: {order.isDelivered ? 'Delivered' : 'Pending'}
                    </Typography>
                    {order.isDelivered && order.deliveredAt && (
                      <Typography variant="caption" color="text.secondary">
                        Delivered on {formatDate(order.deliveredAt)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
