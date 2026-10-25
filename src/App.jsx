import { useMemo, useState, useEffect } from 'react';
import { products, formatPrice } from './products.js';

const WHATSAPP_NUMBER = '916388184100';
const INSTAGRAM_URL = 'https://www.instagram.com/maancandles.13/';
const CATALOGUE_URL = `${import.meta.env.BASE_URL}maan-candles-catalogue.pdf`;
const filters = ['All candles', 'Floral', 'Jars & vessels', 'Sculptural', 'Mini candles'];
const CART_STORAGE_KEY = 'maan_candles_cart_v1';

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),
    spark: (
      <>
        <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
        <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
      </>
    ),
    candle: (
      <>
        <path d="M8 10h8v11H8z" />
        <path d="M12 2c-2 2-2 3.5 0 5 2-1.5 2-3 0-5Z" />
        <path d="M12 7v3" />
        <path d="M6 21h12" />
      </>
    ),
    cart: (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    minus: (
      <>
        <path d="M5 12h14" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </>
    ),
    check: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),
    phone: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </>
    ),
  };
  return <svg {...common}>{paths[name] || paths.spark}</svg>;
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <Icon name="candle" size={24} />
    </span>
  );
}

function WhatsAppLink({ children, className = '', message, productName, ...anchorProps }) {
  const text =
    message ||
    `Hi Maan Candles! I'd like to order ${productName}. Please share availability and shipping charges for my order.`;
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  return (
    <a {...anchorProps} className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function buildWhatsAppOrderUrl(cart, note = '') {
  if (!cart.length) return `https://wa.me/${WHATSAPP_NUMBER}`;

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let message = `✨ *New Order Inquiry - Maan Candles* ✨\n\n`;
  message += `Hello Maan Candles! 🕯️\nI would like to place an order for the following candles:\n\n`;

  cart.forEach((item, index) => {
    const lineTotal = item.product.price * item.quantity;
    const suffix = item.product.priceSuffix ? ` ${item.product.priceSuffix}` : '';
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   • Quantity: ${item.quantity}\n`;
    message += `   • Price: ₹${item.product.price}${suffix} each (₹${lineTotal})\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📦 *Total Candles:* ${totalCount}\n`;
  message += `💰 *Estimated Total:* ₹${totalPrice}\n`;
  if (note && note.trim()) {
    message += `📝 *Note / City:* ${note.trim()}\n`;
  }
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `Please confirm product availability and calculate the shipping charges to my delivery address. Thank you! 🤍`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function ProductCard({
  product,
  index,
  quantity = 0,
  onAddToCart,
  onUpdateQuantity,
  onToggleSelect,
}) {
  const isSelected = quantity > 0;

  return (
    <article
      className={`product-card ${isSelected ? 'is-in-cart' : ''}`}
      style={{ '--card-index': index % 8 }}
    >
      <div className="product-image-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading={index < 4 ? 'eager' : 'lazy'}
        />
        <button
          type="button"
          className={`card-select-btn ${isSelected ? 'selected' : ''}`}
          onClick={() => onToggleSelect(product)}
          aria-label={isSelected ? `Deselect ${product.name}` : `Select ${product.name}`}
          title={isSelected ? 'Remove selection' : 'Select candle'}
        >
          {isSelected ? <Icon name="check" size={13} /> : null}
        </button>

        <span className="product-number">{String(product.id).padStart(2, '0')}</span>
        <span className="product-category">{product.category}</span>
      </div>

      <div className="product-info">
        <div className="product-title-row">
          <h3>{product.name}</h3>
          <span className="product-price">{formatPrice(product)}</span>
        </div>

        <div className="card-actions-row">
          {!isSelected ? (
            <>
              <button
                type="button"
                className="button-add-cart"
                onClick={() => onAddToCart(product)}
              >
                <Icon name="plus" size={14} /> Add to Cart
              </button>
              <WhatsAppLink
                className="quick-order-link"
                productName={`${product.name} (${formatPrice(product)})`}
              >
                Direct order <Icon name="arrow" size={13} />
              </WhatsAppLink>
            </>
          ) : (
            <div className="card-stepper-wrap">
              <div className="quantity-stepper">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  <Icon name="minus" size={13} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  <Icon name="plus" size={13} />
                </button>
              </div>
              <span className="card-subtotal-tag">
                ₹{product.price * quantity}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderNote,
  setOrderNote,
  onExploreClick,
}) {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const checkoutUrl = buildWhatsAppOrderUrl(cart, orderNote);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-root">
      <div className="cart-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="cart-drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <Icon name="cart" size={20} />
            <h2>Your Candle Basket</h2>
            <span className="cart-header-count">({totalCount})</span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-view">
              <span className="cart-empty-icon">🕯️</span>
              <h3>Your basket is empty</h3>
              <p>Add some handcrafted candles from our collection to order multiple items together.</p>
              <button
                type="button"
                className="button button-dark"
                onClick={() => {
                  onClose();
                  onExploreClick();
                }}
              >
                Explore Collection <Icon name="arrow" size={15} />
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="cart-item-row">
                    <div className="cart-item-thumb">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="cart-item-content">
                      <div className="cart-item-top">
                        <div>
                          <h4 className="cart-item-name">{product.name}</h4>
                          <span className="cart-item-unit-price">
                            ₹{product.price}{product.priceSuffix ?? ''} each
                          </span>
                        </div>
                        <button
                          type="button"
                          className="cart-item-trash-btn"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`Remove ${product.name}`}
                          title="Remove item"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="quantity-stepper is-compact">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Icon name="minus" size={12} />
                          </button>
                          <span className="quantity-display">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Icon name="plus" size={12} />
                          </button>
                        </div>
                        <span className="cart-item-total-price">
                          ₹{product.price * quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-note-container">
                <label htmlFor="cart-custom-note">
                  Order Note / Delivery City (optional):
                </label>
                <textarea
                  id="cart-custom-note"
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Gift packaging requested, delivery to Bengaluru..."
                />
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-breakdown">
              <div className="cart-summary-line">
                <span>Items Selected ({totalCount})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="cart-summary-line muted">
                <span>Shipping Charges</span>
                <span>Calculated on WhatsApp</span>
              </div>
              <div className="cart-summary-line total">
                <span>Estimated Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <a
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="checkout-whatsapp-btn"
            >
              <Icon name="message" size={19} />
              <span>Checkout {totalCount} {totalCount === 1 ? 'Item' : 'Items'} via WhatsApp</span>
              <Icon name="arrow" size={16} />
            </a>

            <div className="cart-footer-actions">
              <button
                type="button"
                className="cart-text-btn"
                onClick={onClearCart}
              >
                Clear Cart
              </button>
              <button
                type="button"
                className="cart-text-btn"
                onClick={onClose}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function App() {
  const [activeFilter, setActiveFilter] = useState('All candles');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage unavailable
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => {
      const removed = prev.find((item) => item.product.id === productId);
      if (removed) {
        showToast(`Removed "${removed.product.name}" from cart`);
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const handleToggleSelect = (product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      handleRemoveItem(product.id);
    } else {
      handleAddToCart(product, 1);
    }
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  const totalCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  const cartQuantityMap = useMemo(() => {
    const map = new Map();
    cart.forEach((item) => {
      map.set(item.product.id, item.quantity);
    });
    return map;
  }, [cart]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeFilter === 'All candles' || product.category === activeFilter;
      const matchesSearch =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        String(product.id).includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, search]);

  const allVisibleSelected = useMemo(() => {
    if (!visibleProducts.length) return false;
    return visibleProducts.every((p) => cartQuantityMap.has(p.id));
  }, [visibleProducts, cartQuantityMap]);

  const handleToggleAllVisible = () => {
    if (allVisibleSelected) {
      // Deselect all visible
      const visibleIds = new Set(visibleProducts.map((p) => p.id));
      setCart((prev) => prev.filter((item) => !visibleIds.has(item.product.id)));
      showToast('Deselected filtered candles');
    } else {
      // Select all visible (add missing ones with quantity 1)
      setCart((prev) => {
        const prevIds = new Set(prev.map((i) => i.product.id));
        const toAdd = visibleProducts
          .filter((p) => !prevIds.has(p.id))
          .map((p) => ({ product: p, quantity: 1 }));
        return [...prev, ...toAdd];
      });
      showToast(`Selected all ${visibleProducts.length} candles`);
    }
  };

  const jumpToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <div className="announcement-bar">
        <div className="announcement-content">
          <div className="announcement-tagline">
            <Icon name="spark" size={14} /> Little lights. Beautiful moments.{' '}
            <span className="announcement-divider">·</span> Handmade with love
          </div>
          <div className="announcement-contact">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="announcement-contact-link"
              title="Chat / Order on WhatsApp"
            >
              <Icon name="message" size={13} />
              <span>WhatsApp: +91 63881 84100</span>
            </a>
            <span className="announcement-divider">·</span>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="announcement-contact-link"
              title="Visit Instagram"
            >
              <Icon name="instagram" size={13} />
              <span>@maancandles.13</span>
            </a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <a href="#top" className="brand-lockup" aria-label="Maan Candles home">
          <BrandMark />
          <span className="brand-name-wrap">
            <span className="brand-name">Maan Candles</span>
            <span className="brand-caption">A LITTLE GLOW, A LOT OF HEART</span>
          </span>
        </a>

        <div className="header-actions-group">
          {/* Header Direct Contact */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="header-contact-btn"
            title="Chat with Maan Candles on WhatsApp"
          >
            <Icon name="phone" size={15} />
            <span className="header-contact-text">
              <span className="header-contact-sub">Call / WhatsApp</span>
              <strong className="header-contact-number">+91 63881 84100</strong>
            </span>
          </a>

          {/* Header Cart Button */}
          <button
            type="button"
            className="header-cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping cart with ${totalCount} items`}
          >
            <Icon name="cart" size={19} />
            <span className="header-cart-label">Cart</span>
            {totalCount > 0 && <span className="header-cart-badge">{totalCount}</span>}
          </button>

          <button
            className="mobile-menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'close' : 'spark'} size={22} />
          </button>
        </div>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#collection" onClick={() => setMenuOpen(false)}>
            The collection
          </a>
          <a href="#our-note" onClick={() => setMenuOpen(false)}>
            Our note
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
          <WhatsAppLink
            className="nav-order"
            message="Hi Maan Candles! I'd like to enquire about your candle collection."
          >
            Let’s chat <Icon name="arrow" size={15} />
          </WhatsAppLink>

          <div className="mobile-nav-contact">
            <span className="mobile-nav-contact-title">Direct Contact</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="mobile-contact-pill"
              onClick={() => setMenuOpen(false)}
            >
              <Icon name="phone" size={16} />
              <span>WhatsApp / Call: +91 63881 84100</span>
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mobile-contact-pill"
              onClick={() => setMenuOpen(false)}
            >
              <Icon name="instagram" size={16} />
              <span>Instagram: @maancandles.13</span>
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" /> THE MAAN CANDLES COLLECTION
            </span>
            <h1>
              Little lights.
              <br />
              <em>Beautiful moments.</em>
            </h1>
            <p className="hero-description">
              Thoughtful decorative candles to make everyday corners feel special and
              gifting feel a little more personal. Select multiple designs and order
              effortlessly on WhatsApp.
            </p>
            <div className="hero-actions">
              <button className="button button-dark" onClick={jumpToCollection}>
                Explore the collection <Icon name="arrow" size={17} />
              </button>
              {totalCount > 0 ? (
                <button
                  className="button button-light"
                  onClick={() => setCartOpen(true)}
                >
                  <Icon name="cart" size={16} /> View Cart ({totalCount})
                </button>
              ) : (
                <a
                  className="text-link"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Find us on Instagram <Icon name="arrow" size={15} />
                </a>
              )}
            </div>

            <div className="hero-contact-badge-strip">
              <span className="hero-contact-badge-title">Direct Orders & Inquiries:</span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="hero-contact-chip"
                title="Chat on WhatsApp"
              >
                <Icon name="message" size={14} />
                <span>+91 63881 84100</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="hero-contact-chip"
                title="DM on Instagram"
              >
                <Icon name="instagram" size={14} />
                <span>@maancandles.13</span>
              </a>
            </div>

            <div className="hero-footnote">
              <span className="tiny-flower">✳</span>
              <span>Small-batch charm, made to brighten your moments.</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo-frame">
              <img
                src={`${import.meta.env.BASE_URL}images/sunshine-bouquet.jpg`}
                alt="Sunshine Bouquet decorative candle by Maan Candles"
              />
            </div>
            <div className="hero-sticker">
              <span>made with</span>
              <span>♡</span>
              <span>love</span>
            </div>
            <div className="hero-photo-caption">
              <span className="caption-rule" />{' '}
              <span>THE LITTLE THINGS, LIT BEAUTIFULLY</span>
            </div>
          </div>
          <span className="hero-decoration hero-decoration-one">✳</span>
          <span className="hero-decoration hero-decoration-two">✧</span>
        </section>

        <section className="benefit-strip" aria-label="Store information">
          <div>
            <span className="benefit-icon">✳</span>
            <span>Decorative designs</span>
          </div>
          <span className="benefit-divider" />
          <div>
            <span className="benefit-icon">♡</span>
            <span>Made with love</span>
          </div>
          <span className="benefit-divider" />
          <div>
            <span className="benefit-icon">↗</span>
            <span>Multi-item WhatsApp checkout</span>
          </div>
        </section>

        <section className="collection-section section-container" id="collection">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-line" /> FIND YOUR FAVOURITE
              </span>
              <h2>
                A candle for <em>every little moment.</em>
              </h2>
            </div>
            <p>
              Select multiple candles to build your custom gift set or home bundle.
              Checkout directly to WhatsApp with your entire cart itemized.
            </p>
          </div>

          <div className="collection-toolbar">
            <div className="filter-list" aria-label="Filter products">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <label className="search-box">
              <Icon name="search" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a candle"
                aria-label="Search candles"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch('')}
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </label>
          </div>

          {/* Quick Multi-select Bar */}
          <div className="selection-toolbar">
            <div className="results-line">
              <span>
                {visibleProducts.length} {visibleProducts.length === 1 ? 'design' : 'designs'} to explore
              </span>
              <span className="results-dot" />
              <span>Prices in INR</span>
            </div>

            <div className="selection-controls">
              <button
                type="button"
                className="select-all-button"
                onClick={handleToggleAllVisible}
              >
                {allVisibleSelected ? 'Deselect visible' : 'Select all visible'}
              </button>

              {totalCount > 0 && (
                <button
                  type="button"
                  className="quick-view-cart-btn"
                  onClick={() => setCartOpen(true)}
                >
                  <Icon name="cart" size={15} />
                  <span>Cart: {totalCount} ({`₹${totalPrice}`})</span>
                </button>
              )}
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  quantity={cartQuantityMap.get(product.id) || 0}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">✳</span>
              <h3>No candles found just yet</h3>
              <p>Try another name or browse the full collection.</p>
              <button
                className="button button-outline"
                onClick={() => {
                  setSearch('');
                  setActiveFilter('All candles');
                }}
              >
                Show all candles
              </button>
            </div>
          )}
        </section>

        <section className="note-section" id="our-note">
          <div className="note-flower note-flower-left">✳</div>
          <div className="note-inner">
            <span className="eyebrow eyebrow-centered">A LITTLE SOMETHING FROM US</span>
            <h2>
              A little note from
              <br />
              <em>Maan Candles.</em>
            </h2>
            <p className="note-lead">
              Handcrafted with love, made to brighten your moments.{' '}
              <span aria-hidden="true">🤍</span>
            </p>
            <div className="note-rule">
              <span>✳</span>
            </div>
            <p className="note-body">
              Thank you for supporting our little candle business.
              <br />
              Every order means the world to us!
            </p>
            <div className="note-signoff">
              With warmth, <span>MAAN CANDLES</span>
            </div>
            <div className="note-tagline">Little lights. Beautiful moments.</div>
          </div>
          <div className="note-flower note-flower-right">✧</div>
        </section>

        <section className="order-section section-container" id="contact">
          <div className="order-card">
            <div className="order-copy">
              <span className="eyebrow">
                <span className="eyebrow-line" /> YOUR NEXT LITTLE JOY
              </span>
              <h2>
                Found your favourites?
                <br />
                <em>Let’s make them yours.</em>
              </h2>
              <p>
                Add as many candles as you want to your basket and tap checkout. We will receive
                your exact list on WhatsApp, verify availability, and share shipping charges for your city.
              </p>

              <div className="contact-info-cards">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-info-card"
                  title="Direct WhatsApp"
                >
                  <div className="contact-info-icon">
                    <Icon name="phone" size={20} />
                  </div>
                  <div className="contact-info-meta">
                    <span className="contact-info-label">WhatsApp & Orders</span>
                    <strong className="contact-info-val">+91 63881 84100</strong>
                    <span className="contact-info-hint">Chat directly for availability & shipping</span>
                  </div>
                  <Icon name="arrow" size={16} className="contact-info-arrow" />
                </a>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-info-card"
                  title="Direct Instagram DM"
                >
                  <div className="contact-info-icon">
                    <Icon name="instagram" size={20} />
                  </div>
                  <div className="contact-info-meta">
                    <span className="contact-info-label">Instagram Page</span>
                    <strong className="contact-info-val">@maancandles.13</strong>
                    <span className="contact-info-hint">Follow & message us for latest designs</span>
                  </div>
                  <Icon name="arrow" size={16} className="contact-info-arrow" />
                </a>
              </div>

              {totalCount > 0 && (
                <div className="contact-buttons">
                  <button
                    type="button"
                    className="button button-dark"
                    onClick={() => setCartOpen(true)}
                  >
                    <Icon name="cart" size={17} /> Checkout Cart ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                  </button>
                </div>
              )}
              <a
                className="catalogue-link"
                href={CATALOGUE_URL}
                download="Maan-Candles-Catalogue.pdf"
              >
                Prefer a PDF? Download our catalogue <Icon name="arrow" size={15} />
              </a>
            </div>
            <div className="shipping-card">
              <div className="shipping-icon">
                <Icon name="candle" size={26} />
              </div>
              <span className="shipping-kicker">A QUICK NOTE</span>
              <h3>Shipping & delivery</h3>
              <p>
                Shipping charges apply and vary depending on the total weight and destination of your order.
                We pack every candle carefully with protective layers.
              </p>
              <div className="shipping-line" />
              <span className="shipping-small">Questions? Just send us a message.</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <a href="#top" className="brand-lockup footer-brand">
            <BrandMark />
            <span className="brand-name-wrap">
              <span className="brand-name">Maan Candles</span>
              <span className="brand-caption">LITTLE LIGHTS. BEAUTIFUL MOMENTS.</span>
            </span>
          </a>
          <p>Small details, soft light, beautiful moments.</p>
        </div>

        <div className="footer-contact-block">
          <span className="footer-contact-kicker">Direct Contact & Orders</span>
          <div className="footer-contact-pills">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="footer-contact-pill"
            >
              <Icon name="phone" size={16} />
              <span>WhatsApp / Call: <strong>+91 63881 84100</strong></span>
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="footer-contact-pill"
            >
              <Icon name="instagram" size={16} />
              <span>Instagram: <strong>@maancandles.13</strong></span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Maan Candles. All rights reserved.</span>
          <span className="footer-bottom-tagline">Handmade with love · Little lights. Beautiful moments.</span>
        </div>
      </footer>

      {/* Floating Bottom Bar when items are in cart */}
      {totalCount > 0 && !cartOpen && (
        <div className="floating-cart-bar">
          <button
            type="button"
            className="floating-cart-info"
            onClick={() => setCartOpen(true)}
            aria-label="View selected cart items"
          >
            <span className="floating-cart-icon">
              <Icon name="cart" size={19} />
              <span className="floating-cart-badge">{totalCount}</span>
            </span>
            <div className="floating-cart-text">
              <strong>{totalCount} {totalCount === 1 ? 'candle' : 'candles'} selected</strong>
              <small>Subtotal: ₹{totalPrice}</small>
            </div>
          </button>

          <a
            href={buildWhatsAppOrderUrl(cart, orderNote)}
            target="_blank"
            rel="noreferrer"
            className="floating-checkout-btn"
            title="Checkout on WhatsApp"
          >
            <Icon name="message" size={17} />
            <span>Order on WhatsApp</span>
            <Icon name="arrow" size={14} />
          </a>
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        orderNote={orderNote}
        setOrderNote={setOrderNote}
        onExploreClick={jumpToCollection}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <span className="toast-text">{toastMessage}</span>
          <button
            type="button"
            className="toast-action"
            onClick={() => setCartOpen(true)}
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}
