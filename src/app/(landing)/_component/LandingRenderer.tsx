'use client';

export default function LandingRenderer({ html }: { html: string }) {
  return (
    <iframe
      srcDoc={html}
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
      }}
      sandbox="allow-scripts allow-forms allow-same-origin"
    />
  );
}
