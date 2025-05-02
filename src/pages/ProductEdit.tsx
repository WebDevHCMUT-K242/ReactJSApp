import React, { useState } from "react";
import {
  TextField,
  Button as MuiButton,
  Card,
  CardContent,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const initialVariants = [
  {
    id: "variant-1",
    name: "Red - Small",
    image: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Red+S",
    price: "$19.99"
  },
  {
    id: "variant-2",
    name: "Red - Large",
    image: "https://via.placeholder.com/300x300/ff0000/ffffff?text=Red+L",
    price: "$21.99"
  },
];

function sanitizeInput(value: string) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

export default function ProductEdit() {
  const [variants, setVariants] = useState(initialVariants);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [productName, setProductName] = useState("My Product");
  const [description, setDescription] = useState("Shared description for all variants.");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedIndex(newValue);
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    const updatedVariants = [...variants];
    updatedVariants[selectedIndex] = {
      ...updatedVariants[selectedIndex],
      [name]: sanitizedValue,
    };
    setVariants(updatedVariants);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedVariants = [...variants];
        updatedVariants[selectedIndex].image = reader.result as string;
        setVariants(updatedVariants);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleRemoveVariant = () => {
    if (variants.length <= 1) return;
    const newVariants = variants.filter((_, index) => index !== selectedIndex);
    setVariants(newVariants);
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  };

  const handleAddVariant = () => {
    const newVariant = {
      id: `variant-${Date.now()}`,
      name: "New Variant",
      image: "https://via.placeholder.com/300x300?text=New+Variant",
      price: "$0.00",
    };
    setVariants([...variants, newVariant]);
    setSelectedIndex(variants.length);
  };

  const handleDeleteProduct = () => {
    if (confirm("Are you sure you want to delete this product and all variants?")) {
      setVariants([]);
      setSelectedIndex(0);
      setProductName("");
      setDescription("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="rounded-2xl shadow-lg">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Edit Product Variants</h1>
            <Stack direction="row" spacing={1}>
              <MuiButton variant="outlined" color="error" onClick={handleDeleteProduct}>
                Delete Product
              </MuiButton>
              <MuiButton variant="outlined" onClick={handleAddVariant} startIcon={<AddIcon />}>
                Add Variant
              </MuiButton>
              <MuiButton
                onClick={handleRemoveVariant}
                disabled={variants.length <= 1}
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete Variant
              </MuiButton>
            </Stack>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <TextField
                label="Product Name"
                fullWidth
                value={productName}
                onChange={(e) => setProductName(sanitizeInput(e.target.value))}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(sanitizeInput(e.target.value))}
              />

              <Tabs
                value={selectedIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                {variants.map((variant) => (
                  <Tab key={variant.id} label={variant.name} />
                ))}
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Variant Name"
                  name="name"
                  fullWidth
                  value={variants[selectedIndex]?.name || ""}
                  onChange={handleVariantChange}
                />
                <TextField
                  label="Price"
                  name="price"
                  fullWidth
                  value={variants[selectedIndex]?.price || ""}
                  onChange={handleVariantChange}
                />
              </div>
            </div>

            <div
              onDrop={handleImageDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`mt-4 lg:mt-0 p-4 border-2 border-dashed rounded-xl text-center transition-colors duration-300 ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop an image here (image files only), or paste the image URL below.
              </p>
              {variants[selectedIndex]?.image && (
                <img
                  src={variants[selectedIndex].image}
                  alt="Preview"
                  className="mx-auto mb-2 max-h-60 object-contain"
                />
              )}
              <TextField
                label="Image URL"
                name="image"
                fullWidth
                value={variants[selectedIndex]?.image || ""}
                onChange={handleVariantChange}
              />
            </div>
          </div>

          <div className="mt-10">
            <MuiButton
              variant="contained"
              style={{ backgroundColor: "#22c55e", color: "white" }}
            >
              Save Changes
            </MuiButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}