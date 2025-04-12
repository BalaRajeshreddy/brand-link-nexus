
import React from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Github, Mail, Link } from 'lucide-react';
import { SocialLinksContent } from './BlockEditorMain';

interface SocialLinksBlockProps {
  content: SocialLinksContent;
  styles?: Record<string, any>;
}

export function SocialLinksBlock({ content, styles = {} }: SocialLinksBlockProps) {
  const getSocialIcon = (platform: string) => {
    const size = styles.iconSize || 24;
    const color = styles.iconColor || '#3B82F6';

    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook size={size} color={color} />;
      case 'instagram':
        return <Instagram size={size} color={color} />;
      case 'twitter':
      case 'x':
        return <Twitter size={size} color={color} />;
      case 'linkedin':
        return <Linkedin size={size} color={color} />;
      case 'youtube':
        return <Youtube size={size} color={color} />;
      case 'github':
        return <Github size={size} color={color} />;
      case 'email':
        return <Mail size={size} color={color} />;
      case 'tiktok':
        // Use a custom SVG for TikTok since it's not in lucide-react
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        );
      default:
        return <Link size={size} color={color} />;
    }
  };

  return (
    <div className={cn(
      'social-links-block',
      content.displayType === 'buttons' && 'flex flex-wrap gap-2',
      content.displayType === 'icons' && 'flex flex-wrap',
      styles.gap && `gap-${styles.gap}`
    )}>
      {content.links.map((link, index) => {
        if (content.displayType === 'buttons') {
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center px-4 py-2 rounded transition-colors',
                'bg-gray-100 hover:bg-gray-200 text-gray-800'
              )}
            >
              <span className="mr-2">{getSocialIcon(link.platform)}</span>
              <span>{link.platform}</span>
            </a>
          );
        }

        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'p-2 rounded-full transition-all',
              'hover:scale-110'
            )}
            style={{
              color: styles.iconColor || '#3B82F6',
            }}
          >
            {getSocialIcon(link.platform)}
          </a>
        );
      })}
    </div>
  );
}
