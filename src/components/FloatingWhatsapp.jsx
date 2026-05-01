import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "../config/constants";
import { createGenericWhatsappLink } from "../utils/whatsapp";

function FloatingWhatsapp() {
  const link = createGenericWhatsappLink(
    WHATSAPP_NUMBER,
    "Olá! Quero ajuda para escolher um produto na Zenvra.",
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Zenvra no WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-black shadow-[0_0_35px_rgba(52,211,153,0.35)] transition hover:-translate-y-1 hover:bg-emerald-300 sm:hidden"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

export default FloatingWhatsapp;