import { redirect } from "next/navigation";

/** Rota legada preservada para links antigos; o cadastro oficial vive em /anunciar. */
export default function RegistroProdutoPage() {
  redirect("/anunciar");
}
