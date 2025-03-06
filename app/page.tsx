import Chatbot from "@/components/chatbot";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen">
      <h1>IA Aquecedores Solares</h1>
      <main className="flex-grow p-6">
        <Chatbot />
      </main>
    </div>
  );
}
