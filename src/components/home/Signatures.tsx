import { signatures } from "@/data/menu";
import { SignatureDeck } from "./SignatureDeck";

export function Signatures() {
  return <SignatureDeck items={signatures} />;
}
