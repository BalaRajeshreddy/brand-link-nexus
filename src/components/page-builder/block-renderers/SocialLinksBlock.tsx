import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube, 
  Github, Dribbble, Figma, Twitch, Slack, Music 
} from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksBlockProps {
  content: {
    links: SocialLink[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const SocialLinksBlock = ({ content, styles }: SocialLinksBlockProps) => {
  const getSocialIcon = (platform: string) => {
    const iconProps = {
      size: parseInt(styles.iconSize) || 24,
      color: styles.iconColor || '#3B82F6',
    };
    
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'twitter':
      case 'x':
        return <Twitter {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'github':
        return <Github {...iconProps} />;
      case 'dribbble':
        return <Dribbble {...iconProps} />;
      case 'figma':
        return <Figma {...iconProps} />;
      case 'twitch':
        return <Twitch {...iconProps} />;
      case 'slack':
        return <Slack {...iconProps} />;
      case 'tiktok':
        return <Music {...iconProps} />;
      default:
        return <Linkedin {...iconProps} />;
    }
  };

  return (
    <div 
      className="social-links-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      <div 
        className="flex flex-wrap"
        style={{ 
          gap: styles.gap || '16px',
          justifyContent: content.displayType === 'centered' ? 'center' : 'flex-start'
        }}
      >
        {content.links.map((link, index) => (
          <a 
            key={index} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            title={link.platform}
          >
            {getSocialIcon(link.platform)}
          </a>
        ))}
      </div>
    </div>
  );
};
