import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Button as MuiButton,
  CircularProgress,
} from "@mui/material";

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
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/product/product.php?action=get&id=${id}`);
        const data = await res.json();
        setProduct(data.product);
        setVariants(data.variants);
        setSelectedVariant(data.variants[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedVariant(variants[newValue]);
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
    <div className="max-w-4xl mx-auto p-4">
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={selectedVariant.image.replace(/\\\//g, "/")}
              alt={selectedVariant.name}
              className="rounded-xl w-full h-auto"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-lg text-gray-600">{selectedVariant.name}</p>
            <p className="text-xl font-semibold">${selectedVariant.price}</p>

            <Tabs
              value={tabValue}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              className="my-2"
            >
              {variants.map((variant, index) => (
                <Tab key={variant.id} label={variant.name} />
              ))}
            </Tabs>

            <MuiButton
              variant="contained"
              style={{ backgroundColor: "#facc15", color: "#000" }}
            >
              Add to Cart
            </MuiButton>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">Product Description</h2>
        <p className="text-gray-700 text-base">{product.description}</p>
      </div>
    </div>
  );
}
