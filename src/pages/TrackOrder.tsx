import { Link } from "react-router-dom";
export default function TrackOrder() {
  return <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4"><h1 className="text-2xl font-bold">Rastreamento em manutenção</h1><p>Estamos atualizando a proteção dos dados dos pedidos.</p><Link className="underline" to="/">Voltar ao cardápio</Link></main>;
}
