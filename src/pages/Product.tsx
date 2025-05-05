import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useAuth } from "../common/AuthContext";
interface Variant {
  id: number;
  product_id: number;
  name: string;
  price: string;
  image: string;
}

interface ProductData {
  id: number;
  name: string;
  description: string;
}

export default function Product() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<ProductData | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<number>(1);
  const [adding, setAdding] = useState<boolean>(false);
  const {userCore} = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/product/product.php?action=get&id=${id}`);
        const data = await res.json();
        setProduct(data.product);
        setVariants(data.variants);
        setSelectedVariant(data.variants[0] || null);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedVariant(variants[newValue] || null);
    setAmount(1);
  };

  const adjustAmount = (delta: number) => {
    setAmount(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return;
    setAdding(true);
    try {
      const form = new URLSearchParams();
      form.append('product_id', product.id.toString());
      form.append('variant_id', selectedVariant.id.toString());
      form.append('amount', amount.toString());
      const res = await fetch(
        `/api/order/order.php?action=cart_add`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form.toString(),
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!data.success) {
        console.error('Add to cart failed', data);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!product || variants.length === 0 || !selectedVariant) {
    return <div className="text-center mt-10 text-gray-600">No product found.</div>;
  }

  return (
    <div className="w-full h-full mx-auto bg-white flex flex-col">
      <Card className="rounded-2xl shadow-lg lg:max-w-5xl w-full mx-auto">
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={selectedVariant.image.replace(/\\\//g, "/")}
              alt={selectedVariant.name}
              className="rounded-xl w-full h-auto max-w-lg"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Typography variant="h4" component="h1">
              {product.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {selectedVariant.name}
            </Typography>
            <Typography variant="h5">
              ${selectedVariant.price}
            </Typography>

            {/* Amount controls without icons */}
            <div className="flex items-center space-x-2">
              <Button size="small" onClick={() => adjustAmount(-1)} disabled={userCore?.is_admin || !userCore}>-</Button>
              <Typography>{amount}</Typography>
              <Button size="small" onClick={() => adjustAmount(1)} disabled={userCore?.is_admin || !userCore}>+</Button>
            </div>

            <Button
              variant="contained"
              onClick={handleAddToCart}
              disabled={adding || userCore?.is_admin || !userCore}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </Button>

            <Tabs
              value={tabValue}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              className="my-2"
            >
              {variants.map((variant) => (
                <Tab key={variant.id} label={variant.name} />
              ))}
            </Tabs>

          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-white rounded-xl shadow-md lg:max-w-5xl w-full mx-auto text-black">
        <Typography variant="h6" gutterBottom>
          Product Description
        </Typography>
        <Typography>{product.description}</Typography>
      </div>
    </div>
  );
}
