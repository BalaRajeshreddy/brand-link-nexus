
export enum BlockType {
  HEADING = 'HEADING',
  TEXT = 'TEXT',
  HEADING_TEXT = 'HEADING_TEXT',
  IMAGE = 'IMAGE',
  IMAGES = 'IMAGES',
  IMAGES_LINKS = 'IMAGES_LINKS',
  VIDEO_BLOCK = 'VIDEO_BLOCK',
  TESTIMONIALS_BLOCK = 'TESTIMONIALS_BLOCK',
  SMART_FEEDBACK = 'SMART_FEEDBACK',
  SOCIAL_LINKS = 'SOCIAL_LINKS',
  LINKS = 'LINKS',
  BUTTON = 'BUTTON',
  FORM = 'FORM',
  CONTACT_FORM = 'CONTACT_FORM',
  TEAM = 'TEAM',
  PRODUCTS = 'PRODUCTS',
  PDF = 'PDF',
}

export interface BlockStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  [key: string]: any;
}

export interface BlockContent {
  [key: string]: any;
}

export interface Block {
  id: string;
  type: BlockType | string;  // Allow both enum values and string values
  content: BlockContent;
  styles: BlockStyles;
}
