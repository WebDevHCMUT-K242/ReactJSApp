import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import MuiButton from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useSearchParams } from "react-router-dom";

const initialVariants: Array<{
  id: string;
  name: string;
  image: string;
  price: string;
}> = [];

function sanitizeInput(value: string) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

export default function ProductEdit() {
  const [variants, setVariants] = useState(initialVariants);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">("success");
  const [searchParams] = useSearchParams();
  const [newImages, setNewImages] = useState<Record<string, File>>({});

  const action = searchParams.get("action");
  const id = searchParams.get("id");

  useEffect(() => {
    if (action === "edit" && id) {
      fetch(`/api/product/product.php?action=get&id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProductName(data.product.name || "");
          setDescription(data.product.description || "");
          setVariants(data.variants || []);
          setSelectedIndex(0);
        });
    } else if (action === "create") {
      const newVariant = {
        id: `variant-${Date.now()}`,
        name: "",
        image: "",
        price: "",
      };
      setVariants([newVariant]);
    }
  }, [action, id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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
        setNewImages({ ...newImages, [updatedVariants[selectedIndex].id]: file });
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
      name: "",
      image: "",
      price: "",
    };
    setVariants([...variants, newVariant]);
    setSelectedIndex(variants.length);
  };

  const handleDeleteProduct = () => {
    fetch(`/api/product/product.php?action=delete&id=${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setToastMessage("Product deleted.");
          setToastSeverity("success");
          setToastOpen(true);
        } else {
          throw new Error("Delete failed");
        }
      })
      .catch(() => {
        setToastMessage("Failed to delete product");
        setToastSeverity("error");
        setToastOpen(true);
      });
  };

  const handleSave = async () => {
    const imageDeletes: string[] = [];

    if (action === "edit" && id) {
      try {
        const res = await fetch(`/api/product/product.php?action=get&id=${id}`);
        const data = await res.json();
        const existingImages = data.variants
          .map((v: any) => v.image)
          .filter((img: string) => img && !img.startsWith("data:"));
        imageDeletes.push(...existingImages);
      } catch {}
    }

    const imageUploads = Object.entries(newImages).map(([variantId, file]) => {
      const formData = new FormData();
      formData.append("image", file);
      return fetch("/api/image/upload.php", {
        method: "POST",
        body: formData,
      }).then((res) =>
        res.json().then((data) => {
          if (!data.success) throw new Error(data.error || "Upload failed");
          return [variantId, data.filename] as [string, string];
        })
      );
    });

    let uploadedImageMap: Record<string, string> = {};
    try {
      uploadedImageMap = Object.fromEntries(await Promise.all(imageUploads));
    } catch {
      setToastMessage("Image upload failed");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    const updatedVariants = variants.map((v) => {
      const uploadedFile = uploadedImageMap[v.id];
      return {
        ...v,
        image: uploadedFile ? `/uploaded_images/${uploadedFile}` : v.image,
      };
    });

    try {
      const saveRes = await fetch(
        `/api/product/product.php?action=${action === "edit" ? "save" : "create"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            name: productName,
            description,
            variants: updatedVariants,
          }),
        }
      );
      const saveData = await saveRes.json();
      if (!saveData.success) throw new Error("Save failed");

      await Promise.all(
        imageDeletes.map((filename) =>
          fetch("/api/image/delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ filename: filename.replace("/uploaded_images/", "") }),
          })
        )
      );

      setToastMessage("Saved successfully!");
      setToastSeverity("success");
    } catch {
      setToastMessage("Error saving product");
      setToastSeverity("error");
    } finally {
      setToastOpen(true);
    }
  };

  const isFieldEmpty =
    !variants[selectedIndex]?.image ||
    !productName.trim() ||
    !description.trim() ||
    variants.some((v) => !v.name.trim() || !v.price.trim() || isNaN(Number(v.price)));

  return (
    <div className="bg-white size-full">
      <div className="max-w-7xl mx-auto p-4">
        <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
          <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: "100%" }}>
            {toastMessage}
          </Alert>
        </Snackbar>
        <Card className="rounded-2xl shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4 flex-col md:flex-row">
              <h1 className="text-2xl font-bold ">Edit Product</h1>
              <Stack direction="row" spacing={1}>
                <MuiButton variant="outlined" color="error" onClick={handleDeleteProduct}>
                  Delete Product
                </MuiButton>
                <MuiButton variant="outlined" onClick={handleAddVariant}>
                  Add Variant
                </MuiButton>
                <MuiButton
                  onClick={handleRemoveVariant}
                  disabled={variants.length <= 1}
                  variant="outlined"
                  color="error"
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
                <p className="text-sm text-red-600 h-5">
                  {!productName.trim() ? "Product name is required" : ""}
                </p>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(sanitizeInput(e.target.value))}
                />
                <p className="text-sm text-red-600 h-5">
                  {!description.trim() ? "Description is required" : ""}
                </p>
                {variants.length > 0 && (
                  <>
                    <Tabs value={selectedIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                      {variants.map((variant, index) => {
                        const hasError =
                          !variant.name?.trim() ||
                          !variant.price?.trim() ||
                          isNaN(Number(variant.price)) ||
                          !variant.image?.trim();
                        return (
                          <Tab
                            key={variant.id}
                            label={variant.name || `Variant ${index + 1}`}
                            sx={hasError ? { color: "red" } : {}}
                          />
                        );
                      })}
                    </Tabs>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField
                          label="Variant Name"
                          name="name"
                          fullWidth
                          value={variants[selectedIndex]?.name || ""}
                          onChange={handleVariantChange}
                        />
                        <p className="text-sm text-red-600 h-5">
                          {!variants[selectedIndex]?.name?.trim() ? "Variant name is required" : ""}
                        </p>
                      </div>
                      <div>
                        <TextField
                          label="Price"
                          name="price"
                          fullWidth
                          value={variants[selectedIndex]?.price || ""}
                          onChange={handleVariantChange}
                        />
                        <p className="text-sm text-red-600 h-5">
                          {!variants[selectedIndex]?.price?.trim()
                            ? "Price is required"
                            : isNaN(Number(variants[selectedIndex]?.price))
                            ? "Price must be a number"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {variants.length > 0 && (
                <div
                  onDrop={handleImageDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`mt-4 lg:mt-0 p-4 border-2 border-dashed rounded-xl text-center transition-colors duration-300 ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <p className="text-sm text-gray-600 mb-2">Drag and drop an image here (image files only)</p>
                  {variants[selectedIndex]?.image && (
                    <img
                      src={
                        variants[selectedIndex].image.startsWith("data:")
                          ? variants[selectedIndex].image
                          : variants[selectedIndex].image.startsWith("/uploaded_images/")
                          ? variants[selectedIndex].image
                          : `/uploaded_images/${variants[selectedIndex].image}`
                      }
                      alt="Preview"
                      className="mx-auto mb-2 max-h-60 object-contain"
                    />
                  )}
                  {!variants[selectedIndex]?.image && <p className="text-sm text-red-600">Image is required</p>}
                </div>
              )}
            </div>
            <div className="mt-10">
              <MuiButton
                variant="contained"
                disabled={isFieldEmpty}
                style={{ backgroundColor: isFieldEmpty ? "#d1d5db" : "#22c55e", color: "white" }}
                onClick={handleSave}
              >
                Save Changes
              </MuiButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
