import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Shield, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Package,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  MessageCircle,
  Clock,
  Zap,
  Star,
  TrendingUp
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { createGenericWhatsappLink } from "../utils/whatsapp";

function Checkout({ onClose }) {
  const [step, setStep] = useState(1); // 1: Carrinho, 2: Entrega, 3: Pagamento, 4: Confirmação
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit"); // credit, pix, boleto, whatsapp
  
  // Form data
  const [formData, setFormData] = useState({
    // Entrega
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    // Pagamento
    cardNumber: "",
    cardName: "",
      cardExpiry: "",
    cardCvv: "",
    installments: 1
  });
  
  // Shipping options
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingOptions] = useState([
    { id: "standard", name: "Entrega Padrão", price: 19.90, days: "5-7 dias", icon: Truck },
    { id: "express", name: "Entrega Expressa", price: 39.90, days: "2-3 dias", icon: Zap },
    { id: "sameDay", name: "Entrega no Dia", price: 89.90, days: "Hoje", icon: Clock }
  ]);
  
  const checkoutRef = useRef(null);
  const stepRef = useRef(null);
  const toast = useToast();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('zenvra-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err);
        setCart([]);
      }
    }
  }, []);

  // Animações GSAP
  useEffect(() => {
    if (!checkoutRef.current) return;

    const ctx = gsap.context(() => {
      // Overlay animation
      gsap.fromTo(checkoutRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      // Step animation
      if (stepRef.current) {
        gsap.fromTo(stepRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
        );
      }
    }, checkoutRef);

    return () => ctx.revert();
  }, [step]);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const option = shippingOptions.find(opt => opt.id === shippingMethod);
    return option ? option.price : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (cart.length === 0) {
          toast.error("Seu carrinho está vazio", { duration: 3000 });
          return false;
        }
        return true;
        
      case 2:
        if (!formData.name || !formData.email || !formData.phone || !formData.cep) {
          toast.error("Preencha todos os campos obrigatórios", { duration: 3000 });
          return false;
        }
        
        if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(formData.cep.replace(/\D/g, ''))) {
          toast.error("CEP inválido", { duration: 3000 });
          return false;
        }
        
        return true;
        
      case 3:
        if (paymentMethod === "credit") {
          if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvv) {
            toast.error("Preencha todos os dados do cartão", { duration: 3000 });
            return false;
          }
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleCheckout = async () => {
    if (!validateStep()) return;

    setLoading(true);

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        id: `ZVR-${Date.now()}`,
        items: cart,
        customer: formData,
        shipping: shippingOptions.find(opt => opt.id === shippingMethod),
        payment: paymentMethod,
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        status: paymentMethod === "whatsapp" ? "pending" : "processing",
        createdAt: new Date().toISOString()
      };

      // Salvar pedido
      const orders = JSON.parse(localStorage.getItem('zenvra-orders') || '[]');
      localStorage.setItem('zenvra-orders', JSON.stringify([orderData, ...orders]));

      // Limpar carrinho
      if (paymentMethod !== "whatsapp") {
        localStorage.removeItem('zenvra-cart');
        setCart([]);
      }

      if (paymentMethod === "whatsapp") {
        // WhatsApp checkout
        const message = `💝 *NOVO PEDIDO ZENVRA* 💝
        
📦 *Pedido:* ${orderData.id}
👤 *Cliente:* ${formData.name}
📧 *Email:* ${formData.email}
📱 *Telefone:* ${formData.phone}

🛒 *Produtos:*
${cart.map(item => `• ${item.name} - Tamanho: ${item.size} - Qtd: ${item.quantity} - R$ ${item.price.toFixed(2)}`).join('\n')}

📊 *Resumo:*
• Subtotal: R$ ${calculateSubtotal().toFixed(2)}
• Frete (${shippingOptions.find(opt => opt.id === shippingMethod).name}): R$ ${calculateShipping().toFixed(2)}
• *Total: R$ ${calculateTotal().toFixed(2)}*

🚚 *Entrega:*
${formData.address}, ${formData.number} - ${formData.neighborhood}
${formData.city}/${formData.state}
CEP: ${formData.cep}

💳 *Pagamento:* WhatsApp

---
*Pedido recebido! Aguardamos confirmação para prosseguir.*`;

        const whatsappLink = createGenericWhatsappLink(message);
        window.open(whatsappLink, '_blank');
        
        toast.success("Redirecionando para WhatsApp...", { duration: 3000 });
      } else {
        // Checkout tradicional
        toast.success("Pedido confirmado! 🎉", { duration: 4000 });
      }

      setStep(4);

    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error("Erro ao processar pedido. Tente novamente.", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4}) (\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 $4')
      .replace(/(\d{4}) (\d{4}) (\d{4}) (\d{4}) \d+?$/, '$1 $2 $3 $4');
  };

  const formatCardExpiry = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})\/(\d{4})\d+?$/, '$1/$2');
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, name: "Carrinho", icon: ShoppingCart },
      { id: 2, name: "Entrega", icon: MapPin },
      { id: 3, name: "Pagamento", icon: CreditCard },
      { id: 4, name: "Confirmação", icon: CheckCircle }
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isActive = step === stepItem.id;
          const isCompleted = step > stepItem.id;
          
          return (
            <div key={stepItem.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                isActive 
                  ? "border-emerald-400 bg-emerald-400/20 text-emerald-400"
                  : isCompleted
                  ? "border-emerald-400 bg-emerald-400 text-white"
                  : "border-zinc-600 text-zinc-400"
              }`}>
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? "text-emerald-400" : isCompleted ? "text-white" : "text-zinc-400"
              }`}>
                {stepItem.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? "bg-emerald-400" : "bg-zinc-600"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCartStep = () => (
    <div ref={stepRef} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Seu Carrinho</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-zinc-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Carrinho vazio</h3>
          <p className="text-zinc-400">Adicione produtos para continuar</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-zinc-900/50">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-zinc-800/50">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-6 w-6 text-zinc-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.name}</h4>
                  <p className="text-sm text-zinc-400">Tamanho: {item.size} | Quantidade: {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-emerald-400">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {formatCurrency(item.price)} cada
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resumo do Pedido</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              
              <div className="flex justify-between text-zinc-300">
                <span>Frete</span>
                <span>{formatCurrency(calculateShipping())}</span>
              </div>
              
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span className="text-emerald-400">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderShippingStep = () => (
    <div ref={stepRef} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Dados de Entrega</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Nome Completo *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Telefone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">CPF *</label>
            <input
              type="text"
              value={formData.cpf}
              onChange={(e) => handleInputChange("cpf", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="000.000.000-00"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">CEP *</label>
            <input
              type="text"
              value={formData.cep}
              onChange={(e) => handleInputChange("cep", formatCEP(e.target.value))}
              maxLength={9}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="00000-000"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Endereço *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Rua, Avenida, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Número *</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="123"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Complemento</label>
            <input
              type="text"
              value={formData.complement}
              onChange={(e) => handleInputChange("complement", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Apto, Casa, etc."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Bairro *</label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Centro"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Cidade *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="São Paulo"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Estado *</label>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Selecione</option>
              <option value="AC">AC</option>
              <option value="AL">AL</option>
              <option value="AP">AP</option>
              <option value="AM">AM</option>
              <option value="BA">BA</option>
              <option value="CE">CE</option>
              <option value="DF">DF</option>
              <option value="ES">ES</option>
              <option value="GO">GO</option>
              <option value="MA">MA</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="MG">MG</option>
              <option value="PA">PA</option>
              <option value="PB">PB</option>
              <option value="PR">PR</option>
              <option value="PE">PE</option>
              <option value="PI">PI</option>
              <option value="RJ">RJ</option>
              <option value="RN">RN</option>
              <option value="RS">RS</option>
              <option value="RO">RO</option>
              <option value="RR">RR</option>
              <option value="SC">SC</option>
              <option value="SP">SP</option>
              <option value="SE">SE</option>
              <option value="TO">TO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Opções de Entrega</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shippingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.id}
                className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                  shippingMethod === option.id
                    ? "border-emerald-400 bg-emerald-400/10"
                    : "border-white/10 bg-zinc-900/50 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={shippingMethod === option.id}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="sr-only"
                />
                
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="font-medium text-white">{option.name}</p>
                    <p className="text-sm text-zinc-400">{option.days}</p>
                    <p className="text-sm font-semibold text-emerald-400">{formatCurrency(option.price)}</p>
                  </div>
                </div>
                
                {shippingMethod === option.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div ref={stepRef} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Forma de Pagamento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Payment Methods */}
          <div className="space-y-3">
            <label className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
              paymentMethod === "credit"
                ? "border-emerald-400 bg-emerald-400/10"
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            }`}>
              <input
                type="radio"
                name="payment"
                value="credit"
                checked={paymentMethod === "credit"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-white">Cartão de Crédito</p>
                  <p className="text-sm text-zinc-400">Até 12x sem juros</p>
                </div>
              </div>
              
              {paymentMethod === "credit" && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              )}
            </label>
            
            <label className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
              paymentMethod === "pix"
                ? "border-emerald-400 bg-emerald-400/10"
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            }`}>
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={paymentMethod === "pix"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-white">PIX</p>
                  <p className="text-sm text-zinc-400">5% de desconto</p>
                </div>
              </div>
              
              {paymentMethod === "pix" && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              )}
            </label>
            
            <label className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
              paymentMethod === "boleto"
                ? "border-emerald-400 bg-emerald-400/10"
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            }`}>
              <input
                type="radio"
                name="payment"
                value="boleto"
                checked={paymentMethod === "boleto"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-white">Boleto</p>
                  <p className="text-sm text-zinc-400">3% de desconto</p>
                </div>
              </div>
              
              {paymentMethod === "boleto" && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              )}
            </label>
            
            <label className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
              paymentMethod === "whatsapp"
                ? "border-emerald-400 bg-emerald-400/10"
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            }`}>
              <input
                type="radio"
                name="payment"
                value="whatsapp"
                checked={paymentMethod === "whatsapp"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-white">WhatsApp</p>
                  <p className="text-sm text-zinc-400">Conversar com vendedor</p>
                </div>
              </div>
              
              {paymentMethod === "whatsapp" && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
              )}
            </label>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Credit Card Form */}
          {paymentMethod === "credit" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Dados do Cartão</h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Número do Cartão</label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Nome no Cartão</label>
                <input
                  type="text"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange("cardName", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="NOME COMO NO CARTÃO"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Validade</label>
                  <input
                    type="text"
                    value={formData.cardExpiry}
                    onChange={(e) => handleInputChange("cardExpiry", formatCardExpiry(e.target.value))}
                    maxLength={5}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="MM/AA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">CVV</label>
                  <input
                    type="text"
                    value={formData.cardCvv}
                    onChange={(e) => handleInputChange("cardCvv", e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Parcelas</label>
                <select
                  value={formData.installments}
                  onChange={(e) => handleInputChange("installments", parseInt(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}x de {formatCurrency(calculateTotal() / (i + 1))} sem juros
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* PIX Info */}
          {paymentMethod === "pix" && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-emerald-400" />
                <h3 className="text-lg font-semibold text-emerald-400">PIX - 5% OFF</h3>
              </div>
              <p className="text-emerald-300 mb-4">
                Pague via PIX e ganhe 5% de desconto imediato!
              </p>
              <p className="text-white font-semibold">
                Total com desconto: {formatCurrency(calculateTotal() * 0.95)}
              </p>
              <p className="text-sm text-zinc-400 mt-2">
                Código PIX será gerado após confirmação do pedido
              </p>
            </div>
          )}
          
          {/* Boleto Info */}
          {paymentMethod === "boleto" && (
            <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-400">Boleto - 3% OFF</h3>
              </div>
              <p className="text-blue-300 mb-4">
                Pague via boleto e ganhe 3% de desconto!
              </p>
              <p className="text-white font-semibold">
                Total com desconto: {formatCurrency(calculateTotal() * 0.97)}
              </p>
              <p className="text-sm text-zinc-400 mt-2">
                Boleto será enviado por email após confirmação
              </p>
            </div>
          )}
          
          {/* WhatsApp Info */}
          {paymentMethod === "whatsapp" && (
            <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="h-6 w-6 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">WhatsApp</h3>
              </div>
              <p className="text-green-300 mb-4">
                Finalize seu pedido diretamente com nosso time!
              </p>
              <ul className="text-green-300 space-y-2">
                <li>• Atendimento personalizado</li>
                <li>• Negociação de frete</li>
                <li>• Suporte imediato</li>
                <li>• Parcelamento especial</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div ref={stepRef} className="text-center py-12">
      <CheckCircle className="h-20 w-20 text-emerald-400 mx-auto mb-6" />
      
      <h2 className="text-3xl font-bold text-white mb-4">
        {paymentMethod === "whatsapp" ? "Pedido Enviado!" : "Pedido Confirmado!"}
      </h2>
      
      <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
        {paymentMethod === "whatsapp" 
          ? "Seu pedido foi enviado para nosso time via WhatsApp. Entraremos em contato em breve para finalizar!"
          : "Seu pedido foi confirmado e está sendo processado. Você receberá atualizações por email."
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onClose}
          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
        >
          <ArrowRight className="h-5 w-5" />
          Continuar Comprando
        </button>
        
        {paymentMethod !== "whatsapp" && (
          <button
            onClick={() => window.open('/rastreamento', '_blank')}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
          >
            <Truck className="h-5 w-5" />
            Rastrear Pedido
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={checkoutRef}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          {step === 1 && renderCartStep()}
          {step === 2 && renderShippingStep()}
          {step === 3 && renderPaymentStep()}
          {step === 4 && renderConfirmationStep()}
        </div>

        {/* Footer Actions */}
        {step < 4 && (
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <button
              onClick={step === 1 ? onClose : handlePreviousStep}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 1 ? "Cancelar" : "Voltar"}
            </button>
            
            <div className="text-right">
              <p className="text-sm text-zinc-400">Total</p>
              <p className="text-2xl font-bold text-emerald-400">
                {paymentMethod === "pix" ? formatCurrency(calculateTotal() * 0.95) :
                 paymentMethod === "boleto" ? formatCurrency(calculateTotal() * 0.97) :
                 formatCurrency(calculateTotal())}
              </p>
            </div>
            
            <button
              onClick={step === 3 ? handleCheckout : handleNextStep}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                  Processando...
                </>
              ) : (
                <>
                  {step === 3 ? "Finalizar Pedido" : "Continuar"}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
