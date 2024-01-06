import Image from "next/image";
import { Button } from "./components/Button";
import { MyButton } from "./components/MyButton";
import { MySpecialButton } from "./components/MySpeciallButton";
import { BaseImage } from "./components/Image";

export default function Home() {
  return (
    <main>
      <Button>33333</Button>
      <MyButton>1112211</MyButton>
      <MySpecialButton>MySpecialButton</MySpecialButton>
      <BaseImage src={"/next.svg"} />
      <Image
        src="/next.svg"
        width={50}
        height={50}
        alt="Picture of the author"
      />
    </main>
  );
}
