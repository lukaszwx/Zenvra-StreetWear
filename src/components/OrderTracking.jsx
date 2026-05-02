import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  RefreshCw,
  Download,
  Share2,
  ExternalLink,
  User,
  CreditCard,
  Shield,
  Star,
  MessageCircle,
  Zap
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";

function OrderTracking({ orderId, onClose }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trackingDetails, setTrackingDetails] = useState(null);
  
  const trackingRef = useRef(null);
  const timelineRef = useRef(null);
  const toast = useToast();

  // Mock tracking data (em prod, viria da API)
  const mockTrackingData = {
    "ZVR-123456789": {
      id: "ZVR-123456789",
      status: "delivered",
      estimatedDelivery: "2024-01-20",
      trackingCode: "BR123456789BR",
      carrier: "Correios",
      events: [
        {
          date: "2024-01-15T10:30:00",
          status: "order_confirmed",
          title: "Pedido Confirmado",
          description: "Seu pedido foi confirmado e está sendo processado",
          location: "Centro de Distribuição - São Paulo, SP",
          completed: true
        },
        {
          date: "2024-01-15T14:20:00",
          status: "payment_approved",
          title: "Pagamento Aprovado",
          description: "Pagamento confirmado com sucesso",
          location: "Sistema de Pagamento",
          completed: true
        },
        {
          date: "2024-01-16T09:15:00",
          status: "in_separation",
          title: "Em Separação",
          description: "Seus produtos estão sendo separados no estoque",
          location: "Centro de Distribuição - São Paulo, SP",
          completed: true
        },
        {
          date: "2024-01-16T16:45:00",
          status: "shipped",
          title: "Enviado",
          description: "Pedido despachado para entrega",
          location: "Centro de Distribuição - São Paulo, SP",
          completed: true
        },
        {
          date: "2024-01-17T08:30:00",
          status: "in_transit",
          title: "Em Trânsito",
          description: "Seu pedido está a caminho",
          location: "Agência dos Correios - São Paulo, SP",
          completed: true
        },
        {
          date: "2024-01-18T14:20:00",
          status: "out_for_delivery",
          title: "Saiu para Entrega",
          description: "Seu pedido está com o entregador",
          location: "Agência Local - Rio de Janeiro, RJ",
          completed: true
        },
        {
          date: "2024-01-19T11:45:00",
          status: "delivered",
          title: "Entregue",
          description: "Pedido entregue com sucesso",
          location: "Endereço do Cliente",
          completed: true
        }
      ]
    },
    "ZVR-987654321": {
      id: "ZVR-987654321",
      status: "in_transit",
      estimatedDelivery: "2024-01-22",
      trackingCode: "BR987654321BR",
      carrier: "Jadlog",
      events: [
        {
          date: "2024-01-17T10:30:00",
          status: "order_confirmed",
          title: "Pedido Confirmado",
          description: "Seu pedido foi confirmado e está sendo processado",
          location: "Centro de Distribuição - São Paulo, SP",
          completed: true
        },
        {
          date: "2024-01-17T14:20:00",
          status: "payment_approved",
          title: "Pagamento Aprovado",
          description: "Pagamento confirmado com sucesso",
          location: "Sistema de Pagamento",
          completed: true
        },
        {
          date: "2024-01-18T09:15:00",
          status: "in_separation",
          title: "Em Separação",
          description: "Seus produtos estão sendo separados no estoque",
          location: "Centro de Distribuição - São Paulo, SP",
          completed: true
        },
        {
          date: "2024-01-19T16:45:00",
          status: "shipped",
          title: "Enviado",
          description: "Pedido despachado para entrega",
          location: "Centro de Distribuição - São Paulo, SP",
          completed: true
        },
        {
          date: "2024-01-20T08:30:00",
          status: "in_transit",
          title: "Em Trânsito",
          description: "Seu pedido está a caminho",
          location: "Centro de Distribuição Jadlog - São Paulo, SP",
          completed: true
        },
        {
          date: "2024-01-21T14:20:00",
          status: "out_for_delivery",
          title: "Saiu para Entrega",
          description: "Seu pedido está com o entregador",
          location: "Agência Local - Belo Horizonte, MG",
          completed: false
        },
        {
          date: "2024-01-22T11:45:00",
          status: "delivered",
          title: "Entregue",
          description: "Pedido entregue com sucesso",
          location: "Endereço do Cliente",
          completed: false
        }
      ]
    }
  };

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('zenvra-orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed);
        
        // Select first order if no orderId provided
        if (!orderId && parsed.length > 0) {
          setSelectedOrder(parsed[0]);
        } else if (orderId) {
          const found = parsed.find(order => order.id === orderId);
          if (found) {
            setSelectedOrder(found);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
      }
    }
  }, [orderId]);

  useEffect(() => {
    if (!selectedOrder) return;

    loadTrackingDetails(selectedOrder.id);
  }, [selectedOrder]);

  const loadTrackingDetails = async (orderNumber) => {
    setLoading(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get mock data or create default
      const details = mockTrackingData[orderNumber] || {
        id: orderNumber,
        status: "order_confirmed",
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        trackingCode: "BR" + orderNumber.slice(-9) + "BR",
        carrier: "Correios",
        events: [
          {
            date: new Date().toISOString(),
            status: "order_confirmed",
            title: "Pedido Confirmado",
            description: "Seu pedido foi confirmado e está sendo processado",
            location: "Centro de Distribuição",
            completed: true
          }
        ]
      };
      
      setTrackingDetails(details);
      
    } catch (error) {
      console.error('Erro ao carregar rastreamento:', error);
      toast.error("Erro ao carregar informações de rastreamento", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshTracking = () => {
    if (selectedOrder) {
      loadTrackingDetails(selectedOrder.id);
      toast.info("Atualizando informações de rastreamento...", { duration: 2000 });
    }
  };

  const handleShareTracking = () => {
    if (!trackingDetails) return;
    
    const message = `Rastreamento do Pedido ${trackingDetails.id}
    
Transportadora: ${trackingDetails.carrier}
Código: ${trackingDetails.trackingCode}
Previsão: ${trackingDetails.estimatedDelivery}

Status atual: ${trackingDetails.events[trackingDetails.events.length - 1]?.title}

Acompanhe em tempo real!`;

    if (navigator.share) {
      navigator.share({
        title: `Rastreamento - Pedido ${trackingDetails.id}`,
        text: message
      });
    } else {
      navigator.clipboard.writeText(message);
      toast.success("Link de rastreamento copiado!", { duration: 3000 });
    }
  };

  const handleDownloadInvoice = () => {
    toast.info("Gerando nota fiscal...", { duration: 2000 });
    setTimeout(() => {
      toast.success("Nota fiscal baixada com sucesso!", { duration: 3000 });
    }, 2000);
  };

  const getStatusIcon = (status) => {
    const icons = {
      order_confirmed: CheckCircle,
      payment_approved: CreditCard,
      in_separation: Package,
      shipped: Truck,
      in_transit: Truck,
      out_for_delivery: MapPin,
      delivered: CheckCircle
    };
    
    return icons[status] || Package;
  };

  const getStatusColor = (status) => {
    const colors = {
      order_confirmed: "blue",
      payment_approved: "green",
      in_separation: "yellow",
      shipped: "purple",
      in_transit: "orange",
      out_for_delivery: "red",
      delivered: "emerald"
    };
    
    return colors[status] || "gray";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Animações GSAP
  useEffect(() => {
    if (!trackingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(trackingRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );

      // Timeline animation
      if (timelineRef.current) {
        gsap.fromTo(timelineRef.current?.children || [],
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.2, ease: "power2.out" }
        );
      }
    }, trackingRef);

    return () => ctx.revert();
  }, [trackingDetails]);

  if (!selectedOrder) {
    return (
      <div
        ref={trackingRef}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div className="w-full max-w-4xl max-h-[90vh] bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden p-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-zinc-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Nenhum Pedido Encontrado</h2>
            <p className="text-zinc-400 mb-6">
              Você ainda não possui pedidos. Faça sua primeira compra para acompanhar o rastreamento!
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-400 transition-all hover:bg-emerald-400/20"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={trackingRef}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-zinc-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
              <Truck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Rastreamento de Pedido</h1>
              <p className="text-sm text-zinc-400">{selectedOrder.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshTracking}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10 disabled:opacity-50"
              title="Atualizar"
            >
              <RefreshCw className={`h-4 w-4 text-white ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={handleShareTracking}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10"
              title="Compartilhar"
            >
              <Share2 className="h-4 w-4 text-white" />
            </button>
            
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white/10"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-4" />
                <p className="text-zinc-400">Carregando informações de rastreamento...</p>
              </div>
            </div>
          ) : trackingDetails ? (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Resumo do Pedido</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    trackingDetails.status === 'delivered' 
                      ? 'bg-emerald-400/20 text-emerald-400' 
                      : 'bg-blue-400/20 text-blue-400'
                  }`}>
                    {trackingDetails.status === 'delivered' ? 'Entregue' : 'Em Trânsito'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Transportadora</p>
                    <p className="font-medium text-white">{trackingDetails.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Código de Rastreamento</p>
                    <p className="font-medium text-white">{trackingDetails.trackingCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Previsão de Entrega</p>
                    <p className="font-medium text-white">
                      {new Date(trackingDetails.estimatedDelivery).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Histórico de Entrega</h3>
                
                <div ref={timelineRef} className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-700" />
                  
                  {/* Events */}
                  {trackingDetails.events.map((event, index) => {
                    const Icon = getStatusIcon(event.status);
                    const color = getStatusColor(event.status);
                    
                    return (
                      <div key={index} className="relative flex items-start gap-4 pb-8 last:pb-0">
                        {/* Event Icon */}
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-zinc-900/50 ${
                          event.completed
                            ? `border-${color}-400 bg-${color}-400/10`
                            : 'border-zinc-600 bg-zinc-800/50'
                        }`}>
                          <Icon
                            className={`h-6 w-6 ${
                              event.completed ? `text-${color}-400` : 'text-zinc-500'
                            }`}
                          />
                        </div>
                        
                        {/* Event Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium ${
                              event.completed ? 'text-white' : 'text-zinc-400'
                            }`}>
                              {event.title}
                            </h4>
                            <span className="text-xs text-zinc-500">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          
                          <p className={`text-sm mb-2 ${
                            event.completed ? 'text-zinc-300' : 'text-zinc-500'
                          }`}>
                            {event.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Itens do Pedido</h3>
                
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-xl border border-white/5">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-800/50">
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
                        <p className="text-sm text-zinc-400">
                          Tamanho: {item.size} | Quantidade: {item.quantity}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-emerald-400">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm text-zinc-400 mb-2">
                    <span>Subtotal</span>
                    <span>R$ {selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-400 mb-2">
                    <span>Frete</span>
                    <span>R$ {selectedOrder.shipping?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span className="text-emerald-400">
                      R$ {selectedOrder.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadInvoice}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
                >
                  <Download className="h-5 w-5" />
                  Baixar Nota Fiscal
                </button>
                
                <button
                  onClick={() => window.open(`https://www.correios.com.br/?r=${trackingDetails.trackingCode}`, '_blank')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-medium text-emerald-400 transition-all hover:bg-emerald-400/20"
                >
                  <ExternalLink className="h-5 w-5" />
                  Rastrear no Site
                </button>
                
                <button
                  onClick={() => window.open("https://wa.me/5511999999999?text=Olá! Preciso de ajuda com meu pedido " + trackingDetails.id, "_blank")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-green-400/30 bg-green-400/10 px-6 py-3 font-medium text-green-400 transition-all hover:bg-green-400/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  Suporte WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-zinc-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Informações Indisponíveis</h3>
              <p className="text-zinc-400">Não foi possível carregar as informações de rastreamento</p>
              <button
                onClick={handleRefreshTracking}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 font-medium text-emerald-400 transition-all hover:bg-emerald-400/20"
              >
                <RefreshCw className="h-5 w-5" />
                Tentar Novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
