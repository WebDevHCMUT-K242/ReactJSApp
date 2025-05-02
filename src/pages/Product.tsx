import React, { useState } from "react";
import { Tabs, Tab, Card, CardContent, Button as MuiButton } from "@mui/material";

const productVariants = [
  {
    id: "variant-1",
    name: "Red - Small",
    image: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Red+S",
    price: "$19.99",
  },
  {
    id: "variant-2",
    name: "Red - Large",
    image: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Red+L",
    price: "$21.99",
  },
  {
    id: "variant-3",
    name: "Blue - Small",
    image: "https://via.placeholder.com/300x300/0000ff/ffffff?text=Blue+S",
    price: "$19.99",
  },
  {
    id: "variant-4",
    name: "Blue - Large",
    image: "https://via.placeholder.com/300x300/0000ff/ffffff?text=Blue+L",
    price: "$21.99",
  },
];

export default function Product() {
  const [selectedVariant, setSelectedVariant] = useState(productVariants[0]);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedVariant(productVariants[newValue]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={selectedVariant.image}
              alt={selectedVariant.name}
              className="rounded-xl w-full h-auto"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Awesome Product</h1>
            <p className="text-lg text-gray-600">{selectedVariant.name}</p>
            <p className="text-xl font-semibold">{selectedVariant.price}</p>

            <Tabs
              value={tabValue}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              className="my-2"
            >
              {productVariants.map((variant, index) => (
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
        <p className="text-gray-700 text-base">
          This awesome product is made from high-quality materials and is designed to offer both comfort and durability. Whether you're looking for style or functionality, this product delivers on both fronts. Choose from multiple variants to find the one that suits you best.
        </p>
      </div>
    </div>
  );
}
