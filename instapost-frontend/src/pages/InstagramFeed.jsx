import React, { useEffect } from 'react';

const InstagramEmbed = () => {
  useEffect(() => {
    const loadInstagramEmbed = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => window.instgrm.Embeds.process();
        document.body.appendChild(script);

        // Clean up script when component unmounts
        return () => document.body.removeChild(script);
      }
    };

    loadInstagramEmbed();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink="https://www.instagram.com/p/Bj7bZDshYQ4/?utm_source=ig_embed&utm_campaign=loading"
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: '0',
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: '0',
          width: 'calc(100% - 2px)',
        }}
      >
        <a
          href="https://www.instagram.com/p/Bj7bZDshYQ4/?utm_source=ig_embed&utm_campaign=loading"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#3897f0', fontWeight: '550' }}
        >
          View this post on Instagram
        </a>
      </blockquote>
    </div>
  );
};

export default InstagramEmbed;
