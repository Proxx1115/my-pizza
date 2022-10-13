import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
const Navbar = () => {
  const dispatch = useDispatch();
  const quantity = useSelector((state) => state.cart.quantity);
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.callButton}>
          <Image src="/img/telephone.png" alt="" width="32" height="32" />
        </div>
        <div className={styles.texts}>
          <div className={styles.text}>Одоо захиал</div>
          <div className={styles.text}>8099-2901 </div>
        </div>
      </div>
      <div className={styles.item}>
        <ul className={styles.list}>
          <li className={styles.listItem}>Нүүр</li>
          <li className={styles.listItem}>Бүтээгдэхүүн</li>
          <li className={styles.listItem}>Цэс</li>
          <Link href={"/"} passHref>
            <Image
              className={styles.logo}
              src="/img/logo.png"
              alt=""
              width="100px"
              height="90px"
            />
          </Link>
          <li className={styles.listItem}>Байршилууд</li>
          <li className={styles.listItem}>Блог</li>
          <li className={styles.listItem}>Холбоо барих</li>
        </ul>
      </div>
      <Link href="/cart" passHref>
        <div className={styles.item}>
          <div className={styles.cart}>
            <Image src="/img/cart.png" alt="" width="30px" height="30px" />
            <div className={styles.counter}>{quantity}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
