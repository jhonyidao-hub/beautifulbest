import { SelectionItem, Size, FitType } from './types';

// Using picsum generic images for UI placeholders, 
// in a real app these would be specific fabric swatches/sketches.

export const FABRICS: SelectionItem[] = [
  { id: 'cotton', name: '优质棉', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446' },
  { id: 'linen', name: '天然亚麻', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105' },
  { id: 'silk', name: '桑蚕丝', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3' },
  { id: 'wool', name: '美利奴羊毛', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f' },
  { id: 'denim', name: '靛蓝牛仔布', image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09' },
  { id: 'velvet', name: '皇家天鹅绒', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae' },
  { id: 'leather', name: '仿皮革', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5' },
  { id: 'polyester', name: '运动聚酯', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a' },
];

export const STYLES: SelectionItem[] = [
  { id: 'tshirt', name: '基础T恤', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99' },
  { id: 'hoodie', name: '街头卫衣', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7' },
  { id: 'blazer', name: '正装夹克', image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259' },
  { id: 'dress', name: '夏日连衣裙', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1' },
  { id: 'coat', name: '风衣大衣', image: 'https://images.unsplash.com/photo-1544957992-20514f595d6f' },
  { id: 'skirt', name: '褶皱半身裙', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa' },
];

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const FITS: FitType[] = ['Slim Fit', 'Regular Fit', 'Loose/Oversized', 'Tailored'];

export const STEPS = [
  { id: 1, title: '面料' },
  { id: 2, title: '款式' },
  { id: 3, title: '尺寸' },
  { id: 4, title: '量体' },
  { id: 5, title: '版型' },
  { id: 6, title: '生成' },
];