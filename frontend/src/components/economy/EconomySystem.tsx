import React, { useState, useEffect } from 'react';
import './EconomySystem.css';

interface EconomySystemProps {
  userId: string;
}

const EconomySystem: React.FC<EconomySystemProps> = ({ userId }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('store');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  // Carregar dados econômicos do usuário
  useEffect(() => {
    // Em um ambiente de produção, isso seria uma chamada à API
    const fetchEconomyData = async () => {
      try {
        // Simular carregamento de dados
        setTimeout(() => {
          // Dados simulados
          setBalance(Math.floor(Math.random() * 1000) + 100);
          
          // Transações simuladas
          const mockTransactions = [
            {
              id: 'tx-1',
              type: 'reward',
              amount: 25,
              description: 'Upload de clipe',
              timestamp: new Date(Date.now() - 3600000 * 2) // 2 horas atrás
            },
            {
              id: 'tx-2',
              type: 'reward',
              amount: 50,
              description: 'Vitória em PRYSMS Arsenal',
              timestamp: new Date(Date.now() - 3600000 * 5) // 5 horas atrás
            },
            {
              id: 'tx-3',
              type: 'purchase',
              amount: -200,
              description: 'Moldura de perfil básica',
              timestamp: new Date(Date.now() - 3600000 * 24) // 1 dia atrás
            },
            {
              id: 'tx-4',
              type: 'reward',
              amount: 15,
              description: 'Login diário',
              timestamp: new Date(Date.now() - 3600000 * 26) // 26 horas atrás
            },
            {
              id: 'tx-5',
              type: 'purchase',
              amount: -150,
              description: 'Destaque de clipe (24h)',
              timestamp: new Date(Date.now() - 3600000 * 48) // 2 dias atrás
            },
            {
              id: 'tx-6',
              type: 'deposit',
              amount: 500,
              description: 'Compra de pacote básico',
              timestamp: new Date(Date.now() - 3600000 * 72) // 3 dias atrás
            }
          ];
          
          setTransactions(mockTransactions);
          
          // Status de assinatura simulado
          const randomSubscription = Math.random() > 0.7 ? 
            ['prysms_pass', 'prysms_pro', 'prysms_elite'][Math.floor(Math.random() * 3)] : 
            null;
          
          setSubscriptionStatus(randomSubscription);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados econômicos:', error);
        setLoading(false);
      }
    };

    fetchEconomyData();
  }, [userId]);

  // Pacotes de PRYSMS disponíveis
  const prysmsPackages = [
    {
      id: 'pkg-1',
      name: 'Pacote Iniciante',
      amount: 500,
      bonus: 0,
      price: 9.90,
      popular: false
    },
    {
      id: 'pkg-2',
      name: 'Pacote Básico',
      amount: 1200,
      bonus: 100,
      price: 19.90,
      popular: false
    },
    {
      id: 'pkg-3',
      name: 'Pacote Popular',
      amount: 2500,
      bonus: 300,
      price: 39.90,
      popular: true
    },
    {
      id: 'pkg-4',
      name: 'Pacote Premium',
      amount: 5000,
      bonus: 1000,
      price: 69.90,
      popular: false
    },
    {
      id: 'pkg-5',
      name: 'Pacote Elite',
      amount: 10000,
      bonus: 3000,
      price: 129.90,
      popular: false
    }
  ];

  // Planos de assinatura disponíveis
  const subscriptionPlans = [
    {
      id: 'sub-1',
      name: 'PRYSMS Pass',
      price: 14.90,
      prysmsMonthly: 300,
      benefits: [
        '300 PRYSMS mensais',
        '+1 slot de upload diário',
        'Sem anúncios',
        'Emblema exclusivo'
      ],
      color: '#4f46e5'
    },
    {
      id: 'sub-2',
      name: 'PRYSMS Pro',
      price: 29.90,
      prysmsMonthly: 800,
      benefits: [
        '800 PRYSMS mensais',
        '+3 slots de upload diário',
        'Sem anúncios',
        'Emblema animado exclusivo',
        'Acesso antecipado a eventos',
        '10% de desconto na loja'
      ],
      color: '#8b5cf6',
      popular: true
    },
    {
      id: 'sub-3',
      name: 'PRYSMS Elite',
      price: 49.90,
      prysmsMonthly: 1800,
      benefits: [
        '1800 PRYSMS mensais',
        'Uploads ilimitados',
        'Sem anúncios',
        'Emblema premium exclusivo',
        'Acesso antecipado a eventos',
        '20% de desconto na loja',
        'Cores e molduras exclusivas'
      ],
      color: '#ec4899'
    }
  ];

  // Itens da loja
  const storeItems = [
    {
      id: 'item-1',
      name: 'Moldura Dourada',
      description: 'Uma elegante moldura dourada para seu perfil',
      price: 300,
      category: 'profile',
      image: 'https://picsum.photos/id/1015/200/200'
    },
    {
      id: 'item-2',
      name: 'Pacote de Cores Premium',
      description: 'Desbloqueie cores exclusivas para personalização',
      price: 250,
      category: 'customization',
      image: 'https://picsum.photos/id/1025/200/200'
    },
    {
      id: 'item-3',
      name: 'Emblema de Clã Animado',
      description: 'Adicione efeitos especiais ao emblema do seu clã',
      price: 750,
      category: 'clan',
      image: 'https://picsum.photos/id/1035/200/200'
    },
    {
      id: 'item-4',
      name: 'Banner Personalizado',
      description: 'Um banner exclusivo para destacar seu perfil',
      price: 500,
      category: 'profile',
      image: 'https://picsum.photos/id/1045/200/200'
    },
    {
      id: 'item-5',
      name: 'Pacote de Fontes',
      description: 'Fontes especiais para seu nome de exibição',
      price: 300,
      category: 'customization',
      image: 'https://picsum.photos/id/1055/200/200'
    },
    {
      id: 'item-6',
      name: 'Acelerador de XP (1 dia)',
      description: '+50% de XP em todas atividades por 24 horas',
      price: 200,
      category: 'boost',
      image: 'https://picsum.photos/id/1065/200/200'
    },
    {
      id: 'item-7',
      name: 'Destaque de Clipe (24h)',
      description: 'Destaque seu clipe no feed por 24 horas',
      price: 150,
      category: 'boost',
      image: 'https://picsum.photos/id/1075/200/200'
    },
    {
      id: 'item-8',
      name: 'Moldura Neon',
      description: 'Uma moldura com efeito neon para seu perfil',
      price: 450,
      category: 'profile',
      image: 'https://picsum.photos/id/1085/200/200'
    }
  ];

  // Comprar pacote de PRYSMS
  const handleBuyPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowPurchaseModal(true);
  };

  // Confirmar compra de pacote
  const handleConfirmPurchase = () => {
    if (!selectedPackage) return;
    
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Comprando pacote:', selectedPackage);
    
    // Simular compra bem-sucedida
    setTimeout(() => {
      // Atualizar saldo
      setBalance(prev => prev + selectedPackage.amount + selectedPackage.bonus);
      
      // Adicionar transação
      const newTransaction = {
        id: `tx-${Date.now()}`,
        type: 'deposit',
        amount: selectedPackage.amount + selectedPackage.bonus,
        description: `Compra de ${selectedPackage.name}`,
        timestamp: new Date()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Fechar modal
      setShowPurchaseModal(false);
      setSelectedPackage(null);
    }, 1000);
  };

  // Assinar plano
  const handleSubscribe = (plan: any) => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Assinando plano:', plan);
    
    // Simular assinatura bem-sucedida
    setTimeout(() => {
      setSubscriptionStatus(plan.id.replace('sub-', 'prysms_'));
      
      // Adicionar transação para PRYSMS mensais
      const newTransaction = {
        id: `tx-${Date.now()}`,
        type: 'subscription',
        amount: plan.prysmsMonthly,
        description: `Assinatura ${plan.name} - PRYSMS mensais`,
        timestamp: new Date()
      };
      
      setBalance(prev => prev + plan.prysmsMonthly);
      setTransactions(prev => [newTransaction, ...prev]);
    }, 1000);
  };

  // Cancelar assinatura
  const handleCancelSubscription = () => {
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Cancelando assinatura');
    
    // Simular cancelamento bem-sucedido
    setTimeout(() => {
      setSubscriptionStatus(null);
    }, 1000);
  };

  // Comprar item da loja
  const handleBuyItem = (item: any) => {
    // Verificar se o usuário tem PRYSMS suficientes
    if (balance < item.price) {
      alert('Saldo insuficiente de PRYSMS');
      return;
    }
    
    // Em um ambiente de produção, isso seria uma chamada à API
    console.log('Comprando item:', item);
    
    // Simular compra bem-sucedida
    setTimeout(() => {
      // Atualizar saldo
      setBalance(prev => prev - item.price);
      
      // Adicionar transação
      const newTransaction = {
        id: `tx-${Date.now()}`,
        type: 'purchase',
        amount: -item.price,
        description: item.name,
        timestamp: new Date()
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Feedback ao usuário
      alert(`${item.name} adquirido com sucesso!`);
    }, 500);
  };

  // Formatar data
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return `${Math.floor(diffHours)}h atrás`;
    } else {
      return `${Math.floor(diffHours / 24)}d atrás`;
    }
  };

  // Renderizar modal de compra
  const renderPurchaseModal = () => {
    if (!selectedPackage) return null;
    
    return (
      <div className="modal-overlay">
        <div className="purchase-modal">
          <div className="modal-header">
            <h2>Confirmar Compra</h2>
            <button className="close-button" onClick={() => setShowPurchaseModal(false)}>
              &times;
            </button>
          </div>
          
          <div className="modal-content">
            <div className="package-details">
              <h3>{selectedPackage.name}</h3>
              
              <div className="prysms-amount">
                <i className="icon-prysms"></i>
                <span>{selectedPackage.amount}</span>
                {selectedPackage.bonus > 0 && (
                  <span className="bonus">+{selectedPackage.bonus} bônus</span>
                )}
              </div>
              
              <div className="package-price">
                R$ {selectedPackage.price.toFixed(2)}
              </div>
            </div>
            
            <div className="payment-methods">
              <h4>Método de Pagamento</h4>
              
              <div className="payment-options">
                <div className="payment-option selected">
                  <input type="radio" name="payment" id="credit-card" checked readOnly />
                  <label htmlFor="credit-card">Cartão de Crédito</label>
                </div>
                
                <div className="payment-option">
                  <input type="radio" name="payment" id="pix" disabled />
                  <label htmlFor="pix">PIX</label>
                </div>
                
                <div className="payment-option">
                  <input type="radio" name="payment" id="boleto" disabled />
                  <label htmlFor="boleto">Boleto</label>
                </div>
              </div>
              
              <div className="credit-card-form">
                <div className="form-group">
                  <label>Número do Cartão</label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Validade</label>
                    <input type="text" placeholder="MM/AA" />
                  </div>
                  
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Nome no Cartão</label>
                  <input type="text" placeholder="Nome como aparece no cartão" />
                </div>
              </div>
            </div>
            
            <div className="purchase-summary">
              <div className="summary-item">
                <span>Subtotal</span>
                <span>R$ {selectedPackage.price.toFixed(2)}</span>
              </div>
              
              <div className="summary-item">
                <span>Impostos</span>
                <span>Incluídos</span>
              </div>
              
              <div className="summary-item total">
                <span>Total</span>
                <span>R$ {selectedPackage.price.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="terms">
              <p>
                Ao confirmar a compra, você concorda com os 
                <a href="#"> Termos de Serviço</a> e 
                <a href="#"> Política de Privacidade</a>.
              </p>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="cancel-button" onClick={() => setShowPurchaseModal(false)}>
              Cancelar
            </button>
            <button className="confirm-button" onClick={handleConfirmPurchase}>
              Confirmar Compra
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar aba da loja
  const renderStoreTab = () => {
    return (
      <div className="store-tab">
        <div className="store-categories">
          <button className="category-button active">Todos</button>
          <button className="category-button">Perfil</button>
          <button className="category-button">Personalização</button>
          <button className="category-button">Clã</button>
          <button className="category-button">Boosters</button>
        </div>
        
        <div className="store-items">
          {storeItems.map(item => (
            <div key={item.id} className="store-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="item-price">
                  <i className="icon-prysms"></i>
                  <span>{item.price}</span>
                </div>
              </div>
              <button 
                className="buy-button"
                onClick={() => handleBuyItem(item)}
                disabled={balance < item.price}
              >
                {balance >= item.price ? 'Comprar' : 'Saldo Insuficiente'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar aba de pacotes
  const renderPackagesTab = () => {
    return (
      <div className="packages-tab">
        <div className="packages-grid">
          {prysmsPackages.map(pkg => (
            <div 
              key={pkg.id} 
              className={`package-card ${pkg.popular ? 'popular' : ''}`}
            >
              {pkg.popular && <div className="popular-badge">Mais Popular</div>}
              
              <h3>{pkg.name}</h3>
              
              <div className="package-amount">
                <i className="icon-prysms"></i>
                <span>{pkg.amount}</span>
                {pkg.bonus > 0 && (
                  <span className="bonus">+{pkg.bonus} bônus</span>
                )}
              </div>
              
              <div className="package-price">
                R$ {pkg.price.toFixed(2)}
              </div>
              
              <div className="package-value">
                {pkg.bonus > 0 ? (
                  <span>Valor: R$ {(pkg.price / (pkg.amount + pkg.bonus)).toFixed(4)} por PRYSM</span>
                ) : (
                  <span>Valor: R$ {(pkg.price / pkg.amount).toFixed(4)} por PRYSM</span>
                )}
              </div>
              
              <button 
                className="buy-package-button"
                onClick={() => handleBuyPackage(pkg)}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
        
        <div className="packages-info">
          <h3>Por que comprar PRYSMS?</h3>
          <ul className="benefits-list">
            <li>
              <i className="icon-check"></i>
              <span>Desbloqueie itens cosméticos exclusivos</span>
            </li>
            <li>
              <i className="icon-check"></i>
              <span>Crie e personalize seu próprio clã</span>
            </li>
            <li>
              <i className="icon-check"></i>
              <span>Destaque seus clipes no feed</span>
            </li>
            <li>
              <i className="icon-check"></i>
              <span>Participe de eventos exclusivos</span>
            </li>
            <li>
              <i className="icon-check"></i>
              <span>Apoie a plataforma PRYSMSCLIPS</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Renderizar aba de assinaturas
  const renderSubscriptionsTab = () => {
    return (
      <div className="subscriptions-tab">
        {subscriptionStatus ? (
          <div className="current-subscription">
            <h3>Sua Assinatura Atual</h3>
            
            <div className="subscription-details">
              <div className="subscription-icon">
                <i className="icon-crown"></i>
              </div>
              
              <div className="subscription-info">
                <h4>
                  {subscriptionStatus === 'prysms_pass' && 'PRYSMS Pass'}
                  {subscriptionStatus === 'prysms_pro' && 'PRYSMS Pro'}
                  {subscriptionStatus === 'prysms_elite' && 'PRYSMS Elite'}
                </h4>
                
                <p>
                  Próxima renovação em: <strong>15 dias</strong>
                </p>
                
                <div className="subscription-benefits">
                  <div className="benefit-item">
                    <i className="icon-prysms"></i>
                    <span>
                      {subscriptionStatus === 'prysms_pass' && '300 PRYSMS mensais'}
                      {subscriptionStatus === 'prysms_pro' && '800 PRYSMS mensais'}
                      {subscriptionStatus === 'prysms_elite' && '1800 PRYSMS mensais'}
                    </span>
                  </div>
                  
                  <div className="benefit-item">
                    <i className="icon-upload"></i>
                    <span>
                      {subscriptionStatus === 'prysms_pass' && '+1 slot de upload diário'}
                      {subscriptionStatus === 'prysms_pro' && '+3 slots de upload diário'}
                      {subscriptionStatus === 'prysms_elite' && 'Uploads ilimitados'}
                    </span>
                  </div>
                  
                  <div className="benefit-item">
                    <i className="icon-discount"></i>
                    <span>
                      {subscriptionStatus === 'prysms_pass' && 'Sem anúncios'}
                      {subscriptionStatus === 'prysms_pro' && '10% de desconto na loja'}
                      {subscriptionStatus === 'prysms_elite' && '20% de desconto na loja'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="cancel-subscription-button"
              onClick={handleCancelSubscription}
            >
              Cancelar Assinatura
            </button>
          </div>
        ) : (
          <div className="subscription-plans">
            {subscriptionPlans.map(plan => (
              <div 
                key={plan.id} 
                className={`plan-card ${plan.popular ? 'popular' : ''}`}
                style={{ borderColor: plan.color }}
              >
                {plan.popular && <div className="popular-badge">Mais Popular</div>}
                
                <h3 style={{ color: plan.color }}>{plan.name}</h3>
                
                <div className="plan-price">
                  <span className="price">R$ {plan.price.toFixed(2)}</span>
                  <span className="period">/mês</span>
                </div>
                
                <div className="plan-prysms">
                  <i className="icon-prysms"></i>
                  <span>{plan.prysmsMonthly} PRYSMS mensais</span>
                </div>
                
                <ul className="plan-benefits">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index}>
                      <i className="icon-check"></i>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className="subscribe-button"
                  style={{ backgroundColor: plan.color }}
                  onClick={() => handleSubscribe(plan)}
                >
                  Assinar
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="subscription-faq">
          <h3>Perguntas Frequentes</h3>
          
          <div className="faq-item">
            <h4>Como funciona a assinatura?</h4>
            <p>
              As assinaturas são cobradas mensalmente e renovadas automaticamente. 
              Você pode cancelar a qualquer momento e manter os benefícios até o final do período pago.
            </p>
          </div>
          
          <div className="faq-item">
            <h4>Quando recebo meus PRYSMS mensais?</h4>
            <p>
              Os PRYSMS mensais são creditados imediatamente após a assinatura e, posteriormente, 
              no mesmo dia de cada mês.
            </p>
          </div>
          
          <div className="faq-item">
            <h4>Posso mudar de plano?</h4>
            <p>
              Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
              A diferença será calculada proporcionalmente ao tempo restante do seu período atual.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar aba de histórico
  const renderHistoryTab = () => {
    return (
      <div className="history-tab">
        <div className="transaction-filters">
          <button className="filter-button active">Todas</button>
          <button className="filter-button">Recompensas</button>
          <button className="filter-button">Compras</button>
          <button className="filter-button">Depósitos</button>
        </div>
        
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div 
              key={transaction.id} 
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-icon">
                {transaction.type === 'reward' && <i className="icon-gift"></i>}
                {transaction.type === 'purchase' && <i className="icon-cart"></i>}
                {transaction.type === 'deposit' && <i className="icon-wallet"></i>}
                {transaction.type === 'subscription' && <i className="icon-crown"></i>}
              </div>
              
              <div className="transaction-info">
                <div className="transaction-description">
                  {transaction.description}
                </div>
                <div className="transaction-time">
                  {formatDate(transaction.timestamp)}
                </div>
              </div>
              
              <div className={`transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar componente principal
  return (
    <div className="economy-system">
      <div className="economy-header">
        <div className="balance-card">
          <div className="balance-label">Seu Saldo</div>
          <div className="balance-amount">
            <i className="icon-prysms"></i>
            <span>{balance}</span>
          </div>
          <button 
            className="add-prysms-button"
            onClick={() => setActiveTab('packages')}
          >
            Adicionar PRYSMS
          </button>
        </div>
        
        <div className="daily-rewards">
          <h3>Recompensas Diárias</h3>
          <div className="rewards-progress">
            <div className="day-item claimed">
              <div className="day-number">1</div>
              <div className="day-reward">10</div>
            </div>
            <div className="day-item claimed">
              <div className="day-number">2</div>
              <div className="day-reward">15</div>
            </div>
            <div className="day-item active">
              <div className="day-number">3</div>
              <div className="day-reward">20</div>
            </div>
            <div className="day-item">
              <div className="day-number">4</div>
              <div className="day-reward">25</div>
            </div>
            <div className="day-item">
              <div className="day-number">5</div>
              <div className="day-reward">30</div>
            </div>
            <div className="day-item">
              <div className="day-number">6</div>
              <div className="day-reward">40</div>
            </div>
            <div className="day-item bonus">
              <div className="day-number">7</div>
              <div className="day-reward">100</div>
            </div>
          </div>
          <button className="claim-reward-button">
            Coletar Recompensa Diária
          </button>
        </div>
      </div>
      
      <div className="economy-tabs">
        <div 
          className={`tab-item ${activeTab === 'store' ? 'active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          <i className="icon-store"></i>
          <span>Loja</span>
        </div>
        <div 
          className={`tab-item ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          <i className="icon-package"></i>
          <span>Pacotes</span>
        </div>
        <div 
          className={`tab-item ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          <i className="icon-crown"></i>
          <span>Assinaturas</span>
        </div>
        <div 
          className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="icon-history"></i>
          <span>Histórico</span>
        </div>
      </div>
      
      <div className="economy-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando dados econômicos...</p>
          </div>
        ) : (
          <>
            {activeTab === 'store' && renderStoreTab()}
            {activeTab === 'packages' && renderPackagesTab()}
            {activeTab === 'subscriptions' && renderSubscriptionsTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </>
        )}
      </div>
      
      {showPurchaseModal && renderPurchaseModal()}
    </div>
  );
};

export default EconomySystem;
