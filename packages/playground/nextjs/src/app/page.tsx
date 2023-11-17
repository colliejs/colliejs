import Image from "next/image";
import styles from "./page.module.css";
//@ts-ignore
import { styled } from "@colliejs/react";
const Button = styled("button", {
  backgroundColor: "red",
  color: "blue",
});

export default function Home() {
  return (
    <main className={styles.main}>
      <Button>login</Button>
    </main>
  );
}
