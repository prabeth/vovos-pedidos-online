import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  // Busca produtos da nossa nova API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) newCart[id]--;
      else delete newCart[id];
      return newCart;
    });
  };

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === id || p.id === Number(id));
    return sum + (product?.price || 0) * qty;
  }, 0);

  if (loading) return <div className="flex justify-center items-center h-screen font-sans text-amber-900">Carregando as delícias da Vovó...</div>;

  return (
    <div className="min-h-screen bg-orange-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-amber-700 text-white p-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold tracking-tight">Vovó's Baked Goods</h1>
        <p className="text-amber-100 italic">Feito com amor, de nossa família para a sua.</p>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Lista de Produtos */}
        <section className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <ShoppingCart size={20} /> Escolha os Itens
          </h2>
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <p className="text-amber-700 font-bold">R$ {Number(product.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-amber-50 rounded-full px-2 py-1">
                  <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-amber-700 font-bold">-</button>
                  <span className="font-bold text-amber-900">{cart[product.id] || 0}</span>
                  <button onClick={() => addToCart(product.id)} className="w-8 h-8 flex items-center justify-center bg-amber-700 text-white rounded-full shadow-sm font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resumo e Botão WhatsApp */}
        {total > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="max-w-md mx-auto flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total do pedido</p>
                <p className="text-2xl font-black text-amber-900">R$ {total.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => window.open(`https://wa.me/SEUNUMERO?text=Olá Vovó! Gostaria de encomendar: ${total.toFixed(2)}`, '_blank')}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <Send size={18} /> Pedir Agora
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
