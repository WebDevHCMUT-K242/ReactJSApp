import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';

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
  const { userCore, loading: authLoading } = useAuth()
  
  useEffect(()=>{
    if(userCore?.is_admin) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [userCore])

  const fetchResults = async () => {
    try {
      const res = await fetch(
        `/api/product/search.php?q=${encodeURIComponent(search)}&page=${page}&limit=6`
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

  // const handleSearch = () => {
  //   setPage(1);
  //   fetchResults();
  // };

  const handleDelete = async (productId: number) => {
    try {
      await fetch(`/api/product/product.php?action=delete&id=${productId}`);
      fetchResults()
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };
  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [page, search]);

  return (
    <div className="bg-white w-full h-full">
      <div className=" mx-auto p-8 h-full flex flex-col">
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
        <Grid container spacing={3} className="flex-1" size="grow">
          {results.map((product) => {
            const images = product.variants.map((v) => v.image).filter(Boolean);
            const firstImage = images[0];
            const prices = product.variants.map((v) => v.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            return (
              <Grid size={{xs: 12, md: 6, lg: 4}} >
                    <Card
                      className="rounded-2xl shadow-md w-full flex flex-col justify-between md:flex-row "
                      >
                        <CardActionArea onClick={()=>{navigate(`/product?id=${product.id}`)}}>
                          <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 grow">
                            {firstImage && (
                              <img
                                src={firstImage}
                                alt="Product"
                                className="size-full object-cover rounded-xl md:size-32"
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
                          </CardContent>
                        </CardActionArea>
                            {isAdmin && (
                              <div className="flex gap-2 self-start md:self-center md:flex-col md:mr-4">

                                <Button variant="outlined" color="error" onClick={() => handleDelete(product.id)}>
                                  Delete
                                </Button>
                                <Button variant="outlined"                                   onClick={() =>
                                    navigate(`/product/edit?action=edit&id=${product.id}`)
                                  }>
                                  Edit
                                </Button>
                              </div>
                            )}
                    </Card>
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
