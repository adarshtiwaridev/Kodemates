import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { addToCart, decreaseCart, removeFromCart, resetCart } from '../../slices/cartSlices';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = Number(item.price) || 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const handlingFee = cartItems.length > 0 ? 4.99 : 0;
  const total = subtotal + handlingFee;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShoppingCart size={28} className="text-blue-500" />
              My Cart
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {cartItems.length} course{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>

            {cartItems.length > 0 && (
              <button
                onClick={() => dispatch(resetCart())}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center bg-white dark:bg-slate-900/50">
            <ShoppingCart size={48} className="mx-auto text-slate-400" />
            <h2 className="text-xl font-bold mt-4">Your cart is empty</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Browse courses and add your favorites to get started.
            </p>
            <Link
              to="/courses"
              className="inline-flex mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-40 h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        by {item.instructor}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                          ${(Number(item.price) || 0).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch(decreaseCart(item))}
                            className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-10 text-center font-bold">{item.quantity}</span>

                          <button
                            onClick={() => dispatch(addToCart(item))}
                            className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item))}
                      className="self-start p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-fit sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Handling</span>
                  <span className="font-semibold">${handlingFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors">
                <CreditCard size={18} />
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
