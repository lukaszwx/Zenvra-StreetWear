import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { STORE_NAME, WHATSAPP_NUMBER } from "../config/constants";
import { createGenericWhatsappLink } from "../utils/whatsapp";

const footerLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Categorias", href: "#categorias" },
  { label: "Produtos", href: "#produtos" },
  { label: "Benefícios", href: "#beneficios" },
];

function Footer() {
  const whatsappLink = createGenericWhatsappLink(WHATSAPP_NUMBER);

  return (
    <footer id="contato" className="border-t border-white/10 bg-[#030405]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{STORE_NAME}</h3>
          <p className="text-sm leading-relaxed text-zinc-300">
            Loja streetwear e sneakers com curadoria premium, atendimento próximo e
            envios para todo o Brasil.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            <MessageCircle className="h-4 w-4" />
            Comprar no WhatsApp
          </a>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-200">
            Navegação
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-200">
            Contato
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            <li className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-zinc-400" />
              +55 (85) 99999-9999
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-zinc-400" />
              zenvra@gmail.com
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-zinc-400" />
              José de Freitas - PI
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-200">
            Social
          </h4>
          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-zinc-200 transition hover:border-white/35 hover:bg-white/5"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-zinc-200 transition hover:border-white/35 hover:bg-white/5"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-zinc-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} {STORE_NAME}. Todos os direitos reservados. Conteúdo para fins educacionais-LN
      </div>
    </footer>
  );
}

export default Footer;
