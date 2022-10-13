import styles from "../../styles/Product.module.css";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/cartSlice";
import { toInteger } from "lodash";

const Product = ({ pizza }) => {
  const disptach = useDispatch();
  const [size, setSize] = useState(0);
  const [price, setPrice] = useState(pizza.prices[0]);
  const [extras, setExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const handlePrice = (index) => {
    console.log(pizza.prices[index]);
    const diff = pizza.prices[index] - price;
    setSize(index);
    setPrice(price + diff);
    console.log(price);
  };
  const handleClick = (e, option) => {
    const checked = e.target.checked;

    if (checked) {
      setPrice(price + option.price);
      setExtras((prev) => [...prev, option]);
    } else {
      setPrice(price - option.price);
      setExtras(extras.filter((extra) => extra._id !== option._id));
    }
  };
  const handleAdd = () => {
    console.log({ ...pizza, extras, price, quantity });
    disptach(addProduct({ ...pizza, extras, price, quantity }));
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={pizza.img} objectFit="contain" layout="fill" alt="" />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>${price}</span>
        <p className={styles.desc}>{pizza.desc}</p>
        <h3 className={styles.choose}>Choose the size</h3>
        <div className={styles.sizes}>
          <div className={styles.size} onClick={() => handlePrice(0)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Small</span>
          </div>
          <div className={styles.size} onClick={() => handlePrice(1)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Medium</span>
          </div>
          <div className={styles.size} onClick={() => handlePrice(2)}>
            <Image src="/img/size.png" layout="fill" alt="" />
            <span className={styles.number}>Large</span>
          </div>
        </div>
        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          {pizza.extraOptions.map((option) => {
            return (
              <div className={styles.option} key={option._id}>
                <input
                  type="checkbox"
                  id={option.text}
                  name={option.text}
                  className={styles.checkbox}
                  onClick={(e) => handleClick(e, option)}
                />
                <label htmlFor="double">{option.text}</label>
              </div>
            );
          })}
        </div>
        <div className={styles.add}>
          <input
            type="number"
            defaultValue={1}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className={styles.quantity}
          />
          <button className={styles.button} onClick={handleAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(
    `http://localhost:3000/api/products/${params.id}`
  );
  return {
    props: {
      pizza: res.data,
    },
  };
};

export default Product;
