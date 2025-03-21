import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Button } from "@mui/material";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Button variant="contained" color="primary" onClick={() => dispatch(addToCart(product))}>
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductCard;
