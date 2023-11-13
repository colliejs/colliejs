import Image from "next/image";
import styles from "./page.module.css";
import { styled } from "@colliejs/react";
const Button = styled("button", {
  backgroundColor: "red",
});

export default function Home() {
  return (
    <main className={styles.main}>
      <Button>login</Button>
    </main>
  );
}
