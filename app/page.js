import { Button } from "@/components/ui/button";
import Image from "next/image";
import Provider from "./provider";
export default function Home() {
  return (
    <Provider>
    <div>
      <h1> Hello</h1>

      <Button>Click This</Button>
    </div>
    </Provider>
   
  );
}
