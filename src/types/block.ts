export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  order: number;
  isActive: boolean;
  brandId: string;
  styles?: BlockStyles;
}

export enum BlockType {
  HERO = 'HERO',
  FEATURES = 'FEATURES',
  TESTIMONIALS = 'TESTIMONIALS',
  CONTACT = 'CONTACT',
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  CUSTOM = 'CUSTOM',
  IMAGE = 'IMAGE',
  IMAGE_TEXT = 'IMAGE_TEXT',
  HEADING = 'HEADING',
  TEXT = 'TEXT',
  HEADING_TEXT = 'HEADING_TEXT'
}

export interface BlockStyles {
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
  letterSpacing?: string;
  textColor?: string;
  
  // Layout
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  maxWidth?: string;
  
  // Colors & Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  opacity?: string;
  
  // Border & Shadow
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  boxShadow?: string;
  
  // Image specific
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  
  // Container
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  
  // Animation
  transition?: string;
  transform?: string;
  
  // Custom
  [key: string]: string | undefined;
}

export interface BlockFormData {
  type: BlockType;
  content: BlockContent;
  isActive: boolean;
}

export interface BlockContent {
  // Common content properties
  title?: string;
  description?: string;
  text?: string;
  image?: {
    url: string;
    alt?: string;
  };
  
  // Style properties
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  boxShadow?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  maxWidth?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  
  // Block-specific properties
  [key: string]: any;
} 