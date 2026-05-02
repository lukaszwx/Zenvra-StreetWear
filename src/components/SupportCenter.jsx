import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Truck,
  Package,
  CreditCard,
  Shield,
  Users,
  Headphones,
  Send,
  X,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Video,
  FileText
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

function SupportCenter({ onClose }) {
  const [activeTab, setActiveTab] = useState("help");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "normal"
  });
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  
  const supportRef = useRef(null);
  const tabRef = useRef(null);
  const toast = useToast();

  // FAQ Categories
  const faqCategories = [
    {
      id: "orders",
      name: "Pedidos",
      icon: Package,
      questions: [
        {
          q: "Como faço para rastrear meu pedido?",
          a: "Você pode rastrear seu pedido através da página 'Meus Pedidos' ou usando o código de rastreamento enviado por email. Também oferecemos atualizações em tempo real via WhatsApp."
        },
        {
          q: "Quanto tempo demora a entrega?",
          a: "O prazo de entrega varia: Padrão (5-7 dias), Expressa (2-3 dias), Same Day (no mesmo dia para capitais). O prazo começa a contar após a confirmação do pagamento."
        },
        {
          q: "Posso cancelar meu pedido?",
          a: "Sim, você pode cancelar seu pedido em até 2 horas após a confirmação. Após esse período, entre em contato com nosso suporte para análise."
        },
        {
          q: "Como faço para trocar um produto?",
          a: "Você tem 30 dias para solicitar troca. O produto deve estar com etiqueta original e sem uso. Entre em contato pelo WhatsApp ou abra um chamado no suporte."
        }
      ]
    },
    {
      id: "payment",
      name: "Pagamento",
      icon: CreditCard,
      questions: [
        {
          q: "Quais formas de pagamento aceitam?",
          a: "Aceitamos Cartão de Crédito (até 12x), PIX (5% OFF), Boleto (3% OFF) e WhatsApp. Todas as transações são seguras e criptografadas."
        },
        {
          q: "É seguro comprar com cartão no site?",
          a: "Sim! Utilizamos criptografia SSL de ponta e seguimos os padrões PCI DSS. Seus dados são 100% seguros e nunca são armazenados em nossos servidores."
        },
        {
          q: "Como funciona o pagamento via WhatsApp?",
          a: "Após finalizar o pedido, você será redirecionado para WhatsApp onde nosso time confirmará os detalhes e enviará link de pagamento seguro."
        },
        {
          q: "Posso parcelar no boleto?",
          a: "Boleto é à vista com 3% de desconto. Para parcelamento, recomendamos cartão de crédito (até 12x sem juros) ou WhatsApp (condições especiais)."
        }
      ]
    },
    {
      id: "shipping",
      name: "Entrega",
      icon: Truck,
      questions: [
        {
          q: "Vocês entregam em todo o Brasil?",
          a: "Sim, entregamos em todo o território brasileiro. Para regiões remotas, o prazo pode ser maior e o frete calculado separadamente."
        },
        {
          q: "Como funciona a Same Day Delivery?",
          a: "Entrega no mesmo dia está disponível para capitais e regiões metropolitanas. Pedidos devem ser feitos até as 12h para entrega até as 18h do mesmo dia."
        },
        {
          q: "O que acontece se não estiver em casa na entrega?",
          a: "O transportador tentará até 3 vezes em dias consecutivos. Após isso, o produto retornará ao nosso centro de distribuição e entraremos em contato para reagendar."
        },
        {
          q: "Posso agendar a entrega?",
          a: "Sim! Após a confirmação do pedido, entraremos em contato para combinar o melhor horário. Entregas são realizadas de segunda a sexta, 8h-18h."
        }
      ]
    },
    {
      id: "products",
      name: "Produtos",
      icon: Package,
      questions: [
        {
          q: "Como saber meu tamanho ideal?",
          a: "Cada produto possui uma tabela de medidas detalhada. Recomendamos medir um calçado que você já usa e comparar com nossa tabela. Também oferecemos suporte via WhatsApp para ajuda."
        },
        {
          q: "Os produtos são originais?",
          a: "Sim! Trabalhamos apenas com produtos 100% originais, diretos das marcas autorizadas. Garantia de autenticidade em todos os itens."
        },
        {
          q: "Como faço para cuidar dos meus tênis?",
          a: "Recomendamos limpar com pano úmido e sabão neutro, evitar máquina de lavar, deixar secar à sombra e usar protetores. Cada produto vem com guia de cuidados específico."
        },
        {
          q: "Vocês têm troca por tamanho diferente?",
          a: "Sim! Se o tamanho não servir, você pode fazer troca gratuitamente em até 30 dias. Enviamos o novo tamanho e recolhemos o antigo no mesmo frete."
        }
      ]
    },
    {
      id: "account",
      name: "Minha Conta",
      icon: Users,
      questions: [
        {
          q: "Como faço para criar uma conta?",
          a: "Clique em 'Entrar' no topo do site e depois em 'Criar conta'. Preencha seus dados e confirme o email. Você terá acesso a histórico, favoritos e benefícios exclusivos."
        },
        {
          q: "Esqueci minha senha, como recuperar?",
          a: "Na página de login, clique em 'Esqueci minha senha'. Digite seu email e enviaremos um link para redefinir sua senha rapidamente."
        },
        {
          q: "Posso alterar meus dados cadastrais?",
          a: "Sim! Acesse 'Minha Conta' > 'Meus Dados' para atualizar informações como endereço, telefone e preferências de comunicação."
        },
        {
          q: "Como funciona o programa de fidelidade?",
          a: "A cada compra você acumula pontos que podem ser trocados por descontos. Clientes VIP têm benefícios exclusivos como frete grátis e acesso antecipado a lançamentos."
        }
      ]
    }
  ];

  // Support options
  const supportOptions = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Suporte imediato via WhatsApp",
      icon: MessageCircle,
      action: "Abrir WhatsApp",
      color: "green",
      available: "24/7",
      responseTime: "Imediato"
    },
    {
      id: "phone",
      name: "Telefone",
      description: "Fale diretamente com nosso time",
      icon: Phone,
      action: "Ligar Agora",
      color: "blue",
      available: "Seg-Sex 8h-18h",
      responseTime: "Até 5 min"
    },
    {
      id: "email",
      name: "E-mail",
      description: "Envie sua dúvida por email",
      icon: Mail,
      action: "Enviar E-mail",
      color: "purple",
      available: "24/7",
      responseTime: "Até 24h"
    },
    {
      id: "chat",
      name: "Chat Online",
      description: "Converse em tempo real",
      icon: MessageCircle,
      action: "Iniciar Chat",
      color: "emerald",
      available: "Seg-Sex 9h-21h",
      responseTime: "Até 2 min"
    }
  ];

  // Resources
  const resources = [
    {
      id: "tutorials",
      name: "Tutoriais em Vídeo",
      description: "Aprenda a usar nossos recursos",
      icon: Video,
      items: [
        "Como Comprar",
        "Rastrear Pedidos",
        "Fazer Trocas",
        "Cuidados com Produtos"
      ]
    },
    {
      id: "guides",
      name: "Guias Completo",
      description: "Documentação detalhada",
      icon: BookOpen,
      items: [
        "Guia de Tamanhos",
        "Guia de Compra",
        "Política de Trocas",
        "Termos de Serviço"
      ]
    },
    {
      id: "policies",
      name: "Políticas",
      description: "Regras e diretrizes",
      icon: FileText,
      items: [
        "Política de Privacidade",
        "Termos de Uso",
        "Política de Trocas",
        "Política de Frete"
      ]
    }
  ];

  useEffect(() => {
    if (!supportRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(supportRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );

      gsap.fromTo(tabRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }, supportRef);

    return () => ctx.revert();
  }, []);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    if (!ticketForm.subject || !ticketForm.message) {
      toast.error("Preencha todos os campos obrigatórios", { duration: 3000 });
      return;
    }

    setIsSubmittingTicket(true);

    try {
      // Simular envio do ticket
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Salvar ticket
      const tickets = JSON.parse(localStorage.getItem('zenvra-support-tickets') || '[]');
      const newTicket = {
        id: `TKT-${Date.now()}`,
        ...ticketForm,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('zenvra-support-tickets', JSON.stringify([newTicket, ...tickets]));

      toast.success("Chamado aberto com sucesso! Responderemos em breve.", { duration: 4000 });
      
      // Reset form
      setTicketForm({
        subject: "",
        category: "",
        message: "",
        priority: "normal"
      });
      
      setActiveTab("tickets");
      
    } catch (error) {
      console.error('Erro ao abrir chamado:', error);
      toast.error("Erro ao abrir chamado. Tente novamente.", { duration: 4000 });
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleSupportAction = (option) => {
    switch (option.id) {
      case "whatsapp":
        window.open("https://wa.me/5511999999999?text=Olá! Preciso de ajuda com meu pedido.", "_blank");
        break;
      case "phone":
        window.open("tel:08001234567", "_blank");
        break;
      case "email":
        window.open("mailto:suporte@zenvra.com?subject=Suporte Zenvra", "_blank");
        break;
      case "chat":
        toast.info("Chat online em breve! Use WhatsApp enquanto isso.", { duration: 3000 });
        break;
    }
  };

  const filteredFAQ = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div
      ref={supportRef}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-5xl max-h-[90vh] bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <Headphones className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Central de Ajuda</h1>
              <p className="text-sm text-zinc-400">Estamos aqui para ajudar você</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Tabs */}
          <div ref={tabRef} className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "help", name: "Ajuda Rápida", icon: HelpCircle },
              { id: "contact", name: "Contato", icon: Phone },
              { id: "ticket", name: "Abrir Chamado", icon: MessageCircle },
              { id: "resources", name: "Recursos", icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    activeTab === tab.id
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                      : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === "help" && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar ajuda..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* FAQ Categories */}
              <div className="space-y-4">
                {filteredFAQ.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className="rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
                            <Icon className="h-4 w-4 text-emerald-400" />
                          </div>
                          <span className="font-medium text-white">{category.name}</span>
                        </div>
                        <ChevronRight
                          className={`h-5 w-5 text-zinc-400 transition-transform ${
                            expandedCategory === category.id ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                      
                      {expandedCategory === category.id && (
                        <div className="border-t border-white/10">
                          {category.questions.map((item, index) => (
                            <div key={index} className="p-4 border-b border-white/5 last:border-b-0">
                              <h4 className="font-medium text-white mb-2">{item.q}</h4>
                              <p className="text-zinc-300 text-sm leading-relaxed">{item.a}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredFAQ.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="h-16 w-16 text-zinc-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Nenhuma ajuda encontrada</h3>
                  <p className="text-zinc-400">Tente outros termos ou entre em contato conosco</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Entre em Contato</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSupportAction(option)}
                      className="group relative rounded-2xl border border-white/10 bg-zinc-900/50 p-6 transition-all hover:border-emerald-400/30 hover:shadow-emerald-400/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${option.color}-400/10`}>
                          <Icon className={`h-6 w-6 text-${option.color}-400`} />
                        </div>
                        
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-white mb-1">{option.name}</h4>
                          <p className="text-sm text-zinc-400 mb-3">{option.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-xs text-zinc-500">
                                <Clock className="inline h-3 w-3 mr-1" />
                                {option.available}
                              </p>
                              <p className="text-xs text-zinc-500">
                                <AlertCircle className="inline h-3 w-3 mr-1" />
                                {option.responseTime}
                              </p>
                            </div>
                            
                            <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Emergency Contact */}
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <h3 className="text-lg font-semibold text-red-400">Urgência?</h3>
                </div>
                <p className="text-red-300 mb-4">
                  Para problemas urgentes com pedidos em andamento, ligue imediatamente:
                </p>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-400" />
                  <span className="text-red-300 font-semibold">0800 123-4567</span>
                  <span className="text-red-400 text-sm">24/7</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ticket" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Abrir Chamado</h3>
              
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Assunto *</label>
                    <input
                      type="text"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Breve descrição do problema"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Categoria</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="">Selecione</option>
                      <option value="order">Problema com Pedido</option>
                      <option value="payment">Pagamento</option>
                      <option value="shipping">Entrega</option>
                      <option value="product">Produto</option>
                      <option value="account">Minha Conta</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Prioridade</label>
                  <div className="flex gap-3">
                    {[
                      { value: "low", label: "Baixa", color: "blue" },
                      { value: "normal", label: "Normal", color: "emerald" },
                      { value: "high", label: "Alta", color: "orange" },
                      { value: "urgent", label: "Urgente", color: "red" }
                    ].map((priority) => (
                      <label
                        key={priority.value}
                        className={`cursor-pointer rounded-xl border px-4 py-2 text-sm transition-all ${
                          ticketForm.priority === priority.value
                            ? `border-${priority.color}-400 bg-${priority.color}-400/10 text-${priority.color}-400`
                            : "border-white/10 text-zinc-400 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={priority.value}
                          checked={ticketForm.priority === priority.value}
                          onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                          className="sr-only"
                        />
                        {priority.label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Mensagem *</label>
                  <textarea
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                    placeholder="Descreva detalhadamente seu problema ou dúvida..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20 disabled:opacity-50"
                >
                  {isSubmittingTicket ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Abrir Chamado
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recursos e Documentação</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <div key={resource.id} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10">
                          <Icon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{resource.name}</h4>
                          <p className="text-xs text-zinc-400">{resource.description}</p>
                        </div>
                      </div>
                      
                      <ul className="space-y-2">
                        {resource.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-zinc-300 hover:text-emerald-400 transition-colors cursor-pointer">
                            <ChevronRight className="h-3 w-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Quick Links */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                <h4 className="font-semibold text-white mb-4">Links Rápidos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Status do Pedido",
                    "Política de Trocas",
                    "Tabela de Tamanhos",
                    "Guia de Compra",
                    "Cuidados com Produtos",
                    "Garantia e Qualidade"
                  ].map((link) => (
                    <button
                      key={link}
                      className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                    >
                      <ExternalLink className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm text-zinc-300">{link}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupportCenter;
