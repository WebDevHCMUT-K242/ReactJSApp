import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  CardActionArea
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

type Variant = {
  name: string;
  price: number;
  image: string;
};

type Product = {
  name: string;
  id: number;
  variants: Variant[];
};

const ProductSearch: React.FC = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const fetchAdminStatus = async () => {
    try {
      const res = await fetch('/api/user/me.php');
      const data = await res.json();
      const flag = data.user.is_admin;
      setIsAdmin(Boolean(flag));
    } catch (err) {
      console.error('Failed to fetch user status:', err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch(
        `/api/product/search.php?q=${encodeURIComponent(search)}&page=${page}&limit=5`
      );
      const jsonRes = await res.json();
      const { product_ids: productIds }: { product_ids: number[] } = jsonRes
      setIsLastPage(jsonRes.isLastPage)

      const productsWithVariants = await Promise.all(
        productIds.map(async (id) => {
          const detailRes = await fetch(
            `/api/product/product.php?action=get&id=${id}`
          );
          const detailData = await detailRes.json();
          return {
            id,
            name: detailData.product.name,
            variants: detailData.variants || []
          };
        })
      );

      setResults(productsWithVariants);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchResults();
  };

  const handleDelete = async (productId: number) => {
    try {
      await fetch(`/api/product/product.php?action=delete&id=${productId}`);
      fetchResults()
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };
  useEffect(() => {
    fetchAdminStatus();
    fetchResults();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [page, search]);

  return (
    <div className="bg-white w-full h-full">
      <div className=" mx-auto p-8 h-full">
        {/* Search + Add */}
        <div className="flex flex-wrap gap-2 items-center mb-6">
          <div className="flex-grow">
            <TextField
              fullWidth
              label="Search products"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[56px]"
            />
          </div>
          {isAdmin && (
            <Button
              variant="outlined"
              className="h-[56px]"
              onClick={() => navigate('/product/edit?action=create')}
            >
              Add Product
            </Button>
          )}
        </div>

        {/* Product Cards */}
        <Grid container spacing={3} className="mb-auto" size="grow">
          {results.map((product) => {
            const images = product.variants.map((v) => v.image).filter(Boolean);
            const firstImage = images[0];
            const prices = product.variants.map((v) => v.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            return (
              <Grid size={{xs: 12, md: 6, lg: 4}} >
                  <div onClick={()=>{navigate(`/product?id=${product.id}`)}}>
                    <Card
                      className="rounded-2xl shadow-md w-full flex flex-col justify-between "
                    
                      >
                        <CardActionArea>
                          <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 grow">
                            {firstImage && (
                              <img
                                src={firstImage}
                                alt="Product"
                                className="w-32 h-32 object-cover rounded-xl"
                              />
                            )}
                            <div className="flex-1">
                              <Typography variant="h6">{product.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Price: ${minPrice.toFixed(2)}
                                {minPrice !== maxPrice && ` - $${maxPrice.toFixed(2)}`}
                              </Typography>
                              <Typography variant="body2">
                                Variants: {product.variants.map((v) => v.name).join(', ')}
                              </Typography>
                            </div>
                            {isAdmin && (
                              <div className="flex gap-2 self-start md:self-center">
                                <IconButton
                                  onClick={() =>
                                    navigate(`/product/edit?action=edit&id=${product.id}`)
                                  }
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(product.id)}>
                                  <Delete />
                                </IconButton>
                              </div>
                            )}
                          </CardContent>
                        </CardActionArea>
                    </Card>
                  </div>
              </Grid>
            );
          })}
        </Grid>

        {/* Pagination */}
        {results.length > 0 && (
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outlined"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Typography variant="body2">Page {page}</Typography>
            <Button variant="outlined" onClick={() => setPage((p) => p + 1) } disabled={isLastPage}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
