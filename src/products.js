const base = import.meta.env.BASE_URL;

export const products = [
  { id: 1, name: 'Petal Halo Urli', price: 89, image: 'petal-halo-urli.jpg', category: 'Sculptural' },
  { id: 2, name: 'Coral Flare Daisy', price: 49, image: 'coral-flare-daisy.jpg', category: 'Floral' },
  { id: 3, name: 'Ruby Rosette', price: 49, image: 'ruby-rosette.jpg', category: 'Floral' },
  { id: 4, name: 'Ember Daisy', price: 49, image: 'ember-daisy.jpg', category: 'Floral' },
  { id: 5, name: 'Saffron Sunflower', price: 49, image: 'saffron-sunflower.jpg', category: 'Floral' },
  { id: 6, name: 'Pearl Petal Daisy', price: 49, image: 'pearl-petal-daisy.jpg', category: 'Floral' },
  { id: 7, name: 'Magenta Spark Daisy', price: 49, image: 'magenta-spark-daisy.jpg', category: 'Floral' },
  { id: 8, name: 'Pink Confetti Jar', price: 99, image: 'pink-confetti-jar.jpg', category: 'Jars & vessels' },
  { id: 9, name: 'Pink Filigree Spire', price: 79, image: 'pink-filigree-spire.jpg', category: 'Sculptural' },
  { id: 10, name: 'Rosette Glow Jar', price: 59, image: 'rosette-glow-jar.jpg', category: 'Jars & vessels' },
  { id: 11, name: 'Amethyst Tulip', price: 59, image: 'amethyst-tulip.jpg', category: 'Floral' },
  { id: 12, name: 'Blush & Sage Petals', price: 49, priceSuffix: '/Piece', image: 'blush-sage-petals.jpg', category: 'Floral' },
  { id: 13, name: 'Ivory Sunflower', price: 49, image: 'ivory-sunflower.jpg', category: 'Floral' },
  { id: 14, name: 'Daisy Parade', price: 49, priceSuffix: '/Piece', image: 'daisy-parade.jpg', category: 'Floral' },
  { id: 15, name: 'Mini Meadow Lights', price: 59, image: 'mini-meadow-lights.jpg', category: 'Mini candles' },
  { id: 16, name: 'Amber Sunflower Jar', price: 119, image: 'amber-sunflower-jar.jpg', category: 'Jars & vessels' },
  { id: 17, name: 'Crimson Petal Cup', price: 119, image: 'crimson-petal-cup.jpg', category: 'Jars & vessels' },
  { id: 18, name: 'Ruby Ribbon Mug', price: 89, image: 'ruby-ribbon-mug.jpg', category: 'Jars & vessels' },
  { id: 19, name: 'Crimson Crown Cup', price: 119, image: 'crimson-crown-cup.jpg', category: 'Jars & vessels' },
  { id: 20, name: 'Pearl Pop Cube', price: 99, image: 'pearl-pop-cube.jpg', category: 'Sculptural' },
  { id: 21, name: 'Sunshine Bouquet', price: 69, image: 'sunshine-bouquet.jpg', category: 'Floral' },
  { id: 22, name: 'Amber Fizz Goblet', price: 119, image: 'amber-fizz-goblet.jpg', category: 'Jars & vessels' },
].map((product) => ({ ...product, imageUrl: `${base}images/${product.image}` }));

export const formatPrice = (product) => `₹${product.price}${product.priceSuffix ?? ''}`;
