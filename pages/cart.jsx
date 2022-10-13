import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../redux/cartSlice";
import axios from "axios";
import OrderDetail from "../components/OrderDetail";
const Cart = () => {
  const createOrder = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/orders", data);
      res.status === 201 && router.push("orders/" + res.data._id);
      dispatch(reset());
    } catch (err) {
      console.log(err);
    }
  };
  const cart = useSelector((state) => state.cart);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const amount = cart.total;
  const currency = "USD";
  const style = { layout: "vertical" };
  const ButtonWrapper = ({ currency, showSpinner }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1,
              });
            });
          }}
        />
      </>
    );
  };
  const dispatch = useDispatch();
  console.log(cart);
  console.log("cart");

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Product</th>
              <th>Name</th>
              <th>Extras</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </tbody>
          {cart.product.map((product) => {
            return (
              <tbody key={product._id}>
                <tr className={styles.tr}>
                  <td>
                    <div className={styles.imgContainer}>
                      <Image
                        src={product.img}
                        layout="fill"
                        objectFit="cover"
                        alt=""
                      />
                    </div>
                  </td>
                  <td>
                    <span className={styles.name}>{product.title}</span>
                  </td>
                  <td>
                    <span className={styles.extras}>
                      Double ingredient, spicy sauce
                    </span>
                  </td>
                  <td>
                    <span className={styles.price}>{product.price}</span>
                  </td>
                  <td>
                    <span className={styles.quantity}>{product.quantity}</span>
                  </td>
                  <td>
                    <span className={styles.total}>
                      {product.price * product.quantity}
                    </span>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>${cart.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>${cart.total}
          </div>

          {open ? (
            <div className={styles.paymenMethods}>
              <button
                className={styles.payButton}
                onClick={() => setCash(true)}
              >
                {" "}
                CASH ON DELIVERY{" "}
              </button>
              <PayPalScriptProvider
                options={{
                  "client-id":
                    "Afgr0wY5TLyX_HdnJEVBxzzg9qmGz-M7Xb28C3bbBXYDvApRk8silhBoInXAneym4yuygvkvgQu5JyML",
                  components: "buttons",
                  currency: "USD",
                  "disable-funding": "credit,card,p24",
                }}
              >
                <ButtonWrapper currency={currency} showSpinner={false} />
              </PayPalScriptProvider>
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className={styles.button}>
              CHECKOUT NOW!
            </button>
          )}
        </div>
      </div>
      {cash && <OrderDetail total={cart.total} createOrder={createOrder} />}
    </div>
  );
};

export default Cart;
