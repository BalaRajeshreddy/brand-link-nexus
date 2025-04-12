
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
  // Add missing block types
  HERO = 'HERO',
  VIDEO = 'VIDEO',
  FEATURES = 'FEATURES',
  TESTIMONIALS = 'TESTIMONIALS',
  CONTACT = 'CONTACT',
  CUSTOM = 'CUSTOM',
  IMAGE_TEXT = 'IMAGE_TEXT',
  // Add string-based types that are being used
  HEADING_STRING = 'heading',
  TEXT_STRING = 'text',
  HEADING_TEXT_STRING = 'heading + text',
  IMAGE_STRING = 'image',
  IMAGES_STRING = 'images',
  IMAGES_LINKS_STRING = 'images + links',
  VIDEO_STRING = 'video',
  TESTIMONIALS_STRING = 'testimonials',
  SMART_FEEDBACK_STRING = 'smart feedback',
  SOCIAL_LINKS_STRING = 'social links',
  LINKS_STRING = 'links',
  BUTTON_STRING = 'button',
  FORM_STRING = 'form',
  CONTACT_FORM_STRING = 'contact form',
  TEAM_STRING = 'team',
  PRODUCTS_STRING = 'products',
  APPOINTMENT_CALENDAR = 'appointment/calendar',
  BUSINESS_HOURS = 'business hours',
  PDF_GALLERY = 'pdf gallery',
  OTHER_DETAILS = 'other details',
  IMAGE_TEXT_STRING = 'image + text',
  MAP = 'map'
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
  brandId?: string; // Make brandId optional to fix PageEditorCanvas error
}

// Add BlockFormData interface to fix BlockForm error
export interface BlockFormData {
  type: BlockType | string;
  content: BlockContent;
  isActive?: boolean;
  styles?: BlockStyles;
}
