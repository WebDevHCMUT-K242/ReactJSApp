import React, { useState, useEffect, SyntheticEvent } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '../common/AuthContext';

interface CartItem {
  id: number;
  order_id: string;
  product_id: number;
  variant_id: number;
  amount: number;
  price: number;
  product_name: string;
  variant_name: string;
  total_price: number;
}

interface OrderItem {
  id: number;
  user_id: number;
  order_id: string;
  product_id: number;
  variant_id: number;
  amount: number;
  total_price: number;
  status: string;
  created_at: string;
  product_name: string;
  variant_name: string;
  user_display_name: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem',
});

const Order: React.FC = () => {
  const { userCore } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Determine admin from auth
  useEffect(() => {
    setIsAdmin(!!userCore?.is_admin);
  }, [userCore]);

  // Fetch cart and orders
  const fetchData = async () => {
    setLoading(true);
    if (!isAdmin) {
      const cartRes = await fetch('/api/order/order.php?action=cart_list');
      const cartJson = await cartRes.json();
      setCartItems(
        (cartJson.items || []).map((i: any) => ({
          ...i,
          price: parseFloat(i.price),
          total_price: parseFloat(i.total_price),
        }))
      );
    }
    const ordersRes = await fetch(
      '/api/order/order.php?action=order_list&page=1&limit=100'
    );
    const ordersJson = await ordersRes.json();
    setOrders(
      (ordersJson.orders || []).map((o: any) => ({
        ...o,
        total_price: parseFloat(o.total_price),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (userCore) fetchData();
  }, [isAdmin, userCore]);

  const handleTabChange = (_: SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  // Cart actions for non-admin
  const handleCartUpdate = async (item: CartItem, delta: number) => {
    const newAmount = Math.max(1, item.amount + delta);
    await fetch('/api/order/order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'cart_update',
        item_id: item.id.toString(),
        amount: newAmount.toString(),
      }),
    });
    fetchData();
  };

  const handleCartRemove = async (itemId: number) => {
    await fetch('/api/order/order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'cart_remove', item_id: itemId.toString() }),
    });
    fetchData();
  };

  const handleCheckout = async () => {
    await fetch('/api/order/order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'cart_checkout' }),
    });
    // switch to Pending tab
    setTabIndex(0);
    fetchData();
  };

  // Admin action: change status
  const handleStatusChange = async (orderId: string, status: string) => {
    await fetch('/api/order/order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ action: 'order_update_status', order_id: orderId, status }),
    });
    fetchData();
  };

  if (loading && userCore) {
    return (
        <div className="bg-white size-full py-auto">
            <div className="mt-56">
                <LoadingContainer className=''>
                  <CircularProgress />
                </LoadingContainer>
            </div>
        </div>
    );
  }
if (!userCore) {
    return (
        <div className="bg-white size-full  flex">
            <div className="my-auto mx-auto">
                <p className='text-black mx-auto'>Please login to use this feature!</p>
            </div>
        </div>
      );
  }

  const statusTabs = ['Pending', 'Shipping', 'Delivered', 'Canceled'];
  const tabs = isAdmin ? statusTabs : ['Shopping Cart', ...statusTabs];

  const cartTotal = cartItems.reduce((sum, i) => sum + i.total_price, 0);

  return (
    <div className="size-full bg-white ">
        <div className="max-w-6xl mx-auto">
            <Box sx={{ width: '100%' }}>
              <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Order Tabs">
                {tabs.map((label, idx) => (
                  <Tab key={label} label={label} />
                ))}
              </Tabs>
              {/* Shopping Cart */}
              {!isAdmin && (
                <TabPanel value={tabIndex} index={0}>
                  <Typography variant="h6">Shopping Cart</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Variant</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="center">Amount</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.variant_name}</TableCell>
                            <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                            <TableCell align="center">
                              <Button size="small" onClick={() => handleCartUpdate(item, -1)}>-</Button>
                              {item.amount}
                              <Button size="small" onClick={() => handleCartUpdate(item, 1)}>+</Button>
                            </TableCell>
                            <TableCell align="right">${item.total_price.toFixed(2)}</TableCell>
                            <TableCell align="center">
                              <Button color="error" size="small" onClick={() => handleCartRemove(item.id)}>
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="h6">Total: ${cartTotal.toFixed(2)}</Typography>
                    <Button variant="contained" onClick={handleCheckout} disabled={cartItems.length === 0}>
                      Checkout
                    </Button>
                  </Box>
                </TabPanel>
              )}
              {/* Orders by status */}
              {statusTabs.map((status, idx) => {
                const panelIndex = isAdmin ? idx : idx + 1;
                const list = orders.filter(o => o.status === status.toLowerCase());
                return (
                  <TabPanel key={status} value={tabIndex} index={panelIndex}>
                    <Typography variant="h6">{status} Orders</Typography>
                    {list.length === 0 ? (
                      <Typography>No orders.</Typography>
                    ) : (
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {!isAdmin && <TableCell>Order ID</TableCell>}
                              {isAdmin && <TableCell>User </TableCell>}
                              <TableCell>Product</TableCell>
                              <TableCell>Variant</TableCell>
                              <TableCell align="center">Amount</TableCell>
                              <TableCell align="right">Total</TableCell>
                              <TableCell>Date</TableCell>
                              {isAdmin && <TableCell align="center">Change Status</TableCell>}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {list.map(o => (
                              <TableRow key={o.id}>
                                {!isAdmin ? <TableCell>{o.order_id}</TableCell> : <TableCell>{o.user_display_name}</TableCell>}
                                <TableCell>{o.product_name}</TableCell>
                                <TableCell>{o.variant_name}</TableCell>
                                <TableCell align="center">{o.amount}</TableCell>
                                <TableCell align="right">${o.total_price.toFixed(2)}</TableCell>
                                <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                                {isAdmin && (
                                  <TableCell align="center">
                                    { (
                                      <>
                                        <Button size="small" onClick={() => handleStatusChange(o.order_id, 'shipping')}>Ship</Button>
                                        <Button size="small" onClick={() => handleStatusChange(o.order_id, 'delivered')}>Deliver</Button>
                                        <Button size="small" onClick={() => handleStatusChange(o.order_id, 'canceled')}>Cancel</Button>
                                      </>
                                    )}
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </TabPanel>
                );
              })}
            </Box>
        </div>
    </div>
  );
};

export default Order;
