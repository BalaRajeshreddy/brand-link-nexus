
import React from 'react';

interface ProductComponentRendererProps {
  type: string;
  content: Record<string, any>;
  styles: Record<string, any>;
}

export function ProductComponentRenderer({
  type,
  content,
  styles,
}: ProductComponentRendererProps) {
  const renderComponent = () => {
    switch (type) {
      case 'text':
        return (
          <div style={styles}>
            {content.text || "Text content goes here"}
          </div>
        );
        
      case 'button':
        return (
          <button
            style={{
              backgroundColor: styles.backgroundColor || "#3B82F6",
              color: styles.color || "#FFFFFF",
              padding: styles.padding || "8px 16px",
              borderRadius: styles.borderRadius || "4px",
              fontSize: styles.fontSize || "14px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (content.url) {
                window.open(content.url, '_blank');
              }
            }}
          >
            {content.text || "Button"}
          </button>
        );
        
      case 'image':
        return content.src ? (
          <img
            src={content.src}
            alt={content.alt || "Product image"}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              ...styles
            }}
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
            }}
          />
        ) : (
          <div 
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              ...styles
            }}
          >
            No image selected
          </div>
        );
        
      case 'action':
        const handleActionClick = () => {
          const actionType = content.actionType || 'link';
          const target = content.url || '';
          
          if (actionType === 'link' && target) {
            window.open(target, '_blank');
          } else if (actionType === 'scroll' && target) {
            const element = document.querySelector(target);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          } else if (actionType === 'popup') {
            alert('Action: Show popup (Demo functionality)');
          }
        };
        
        return (
          <button
            style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              padding: "8px 16px",
              borderRadius: "4px",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              ...styles
            }}
            onClick={handleActionClick}
          >
            {content.label || "Action"}
          </button>
        );
        
      case 'youtube':
        const videoId = content.videoId || "";
        
        return videoId ? (
          <div style={{ width: '100%', ...styles }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                src={`https://www.youtube.com/embed/${videoId}`}
                title={content.title || "YouTube video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {content.title && (
              <p style={{ marginTop: '8px', fontWeight: 500 }}>{content.title}</p>
            )}
          </div>
        ) : (
          <div 
            style={{ 
              width: '100%',
              padding: '16px',
              backgroundColor: '#f0f0f0',
              textAlign: 'center',
              ...styles
            }}
          >
            Enter a YouTube video ID
          </div>
        );
        
      case 'instagram':
        return (
          <div style={{ width: '100%', ...styles }}>
            <div style={{ 
              border: '1px solid #dbdbdb', 
              borderRadius: '4px',
              padding: '16px',
              textAlign: 'center' 
            }}>
              {content.postUrl ? (
                <p>Instagram embed: {content.postUrl}</p>
              ) : (
                <p>Enter Instagram post URL</p>
              )}
              <p style={{ fontSize: '12px', marginTop: '8px' }}>
                (Instagram embed preview - requires Instagram API integration)
              </p>
            </div>
          </div>
        );
        
      case 'ingredients':
        const ingredients = content.list ? content.list.split(',').map((item: string) => item.trim()) : [];
        
        return (
          <div style={{ width: '100%', ...styles }}>
            <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Ingredients</h3>
            {ingredients.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {ingredients.map((ingredient: string, index: number) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>No ingredients specified</p>
            )}
          </div>
        );
        
      case 'ratings':
        const renderStars = (rating: number) => {
          const stars = [];
          const fullStars = Math.floor(rating);
          const hasHalfStar = rating % 1 >= 0.5;
          
          for (let i = 0; i < fullStars; i++) {
            stars.push('★');
          }
          
          if (hasHalfStar) {
            stars.push('★');
          }
          
          while (stars.length < 5) {
            stars.push('☆');
          }
          
          return (
            <div style={{ color: '#FFC107', letterSpacing: '2px' }}>
              {stars.join('')}
            </div>
          );
        };
        
        return (
          <div style={{ width: '100%', ...styles }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ marginRight: '10px' }}>
                {renderStars(content.rating || 0)}
              </div>
              <div>
                <span style={{ fontWeight: 700 }}>{content.rating || 0}</span>
                <span style={{ color: '#6B7280' }}> ({content.reviewCount || 0} reviews)</span>
              </div>
            </div>
            
            {content.reviews && content.reviews.length > 0 && (
              <div>
                <h4 style={{ fontWeight: 500, marginBottom: '8px' }}>Customer Reviews</h4>
                {content.reviews.map((review: any, index: number) => (
                  <div key={index} style={{ marginBottom: '12px', borderBottom: index < content.reviews.length - 1 ? '1px solid #E5E7EB' : 'none', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ color: '#FFC107', marginRight: '6px' }}>{'★'.repeat(review.rating)}</span>
                      <span style={{ fontWeight: 500 }}>{review.author}</span>
                    </div>
                    <p style={{ margin: 0 }}>{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'story':
        return (
          <div style={{ width: '100%', ...styles }}>
            <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Our Story</h3>
            <p style={{ lineHeight: '1.6' }}>{content.story || "No story content provided"}</p>
          </div>
        );
        
      case 'howmade':
        return (
          <div style={{ width: '100%', ...styles }}>
            <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>How It's Made</h3>
            <p style={{ marginBottom: '16px' }}>{content.description || "No description provided"}</p>
            
            {content.steps && content.steps.length > 0 && (
              <ol style={{ paddingLeft: '20px' }}>
                {content.steps.map((step: string, index: number) => (
                  <li key={index} style={{ marginBottom: '8px' }}>{step}</li>
                ))}
              </ol>
            )}
          </div>
        );
        
      case 'nutrition':
        return (
          <div style={{ width: '100%', ...styles }}>
            <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>Nutrition Facts</h3>
            <div style={{ borderTop: '8px solid #000', borderBottom: '4px solid #000' }}>
              {content.facts && Object.entries(content.facts).map(([key, value], index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '4px 0',
                  borderBottom: '1px solid #E5E7EB' 
                }}>
                  <span style={{ fontWeight: key === 'Calories' ? 700 : 400 }}>{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Unknown component type: {type}</div>;
    }
  };

  return renderComponent();
}
