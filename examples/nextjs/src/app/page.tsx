import Image from "next/image";
import { Button } from "./components/Button";
import { MyButton } from "./components/MyButton";
import { MySpecialButton } from "./components/MySpeciallButton";

export default function Home() {
  return (
    <main>
      <Button>Button</Button>
      <MyButton>MyBUtton</MyButton>
      <MySpecialButton>MySpecialButton</MySpecialButton>
    </main>
  );
}
