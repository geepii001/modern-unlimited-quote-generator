export function createWallpaper(quote: { text: string; author: string; category: string }): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size for wallpaper (1920x1080)
    canvas.width = 1920;
    canvas.height = 1080;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#F0F8FF');
    gradient.addColorStop(0.33, '#E6E6FA');
    gradient.addColorStop(0.66, '#E8B4FF');
    gradient.addColorStop(1, '#B4E8FF');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add floating elements
    const addFloatingElement = (x: number, y: number, radius: number, color: string, alpha: number) => {
      const elementGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      elementGradient.addColorStop(0, color.replace(')', `, ${alpha})`).replace('rgb', 'rgba'));
      elementGradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
      ctx.fillStyle = elementGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Add decorative floating elements
    addFloatingElement(200, 200, 80, 'rgb(232, 180, 255)', 0.3);
    addFloatingElement(1600, 300, 60, 'rgb(180, 232, 255)', 0.25);
    addFloatingElement(300, 800, 100, 'rgb(255, 228, 180)', 0.2);
    addFloatingElement(1500, 750, 70, 'rgb(232, 180, 255)', 0.35);
    
    // Configure text styling
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add quote text
    ctx.fillStyle = '#2F2F2F';
    ctx.font = 'italic 600 60px "Playfair Display", serif';
    
    const maxWidth = canvas.width - 300;
    const quoteText = `"${quote.text}"`;
    const lines = wrapText(ctx, quoteText, maxWidth);
    const lineHeight = 85;
    const totalTextHeight = lines.length * lineHeight;
    const startY = (canvas.height / 2) - (totalTextHeight / 2);
    
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
    });
    
    // Add author
    ctx.font = '500 40px "Inter", sans-serif';
    ctx.fillStyle = '#2F2F2F';
    ctx.fillText(`— ${quote.author}`, canvas.width / 2, startY + (lines.length * lineHeight) + 80);
    
    // Add category badge
    const badgeY = startY + (lines.length * lineHeight) + 160;
    const badgeWidth = 200;
    const badgeHeight = 50;
    const badgeX = (canvas.width / 2) - (badgeWidth / 2);
    
    const badgeGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
    badgeGradient.addColorStop(0, '#E8B4FF');
    badgeGradient.addColorStop(1, '#B4E8FF');
    
    ctx.fillStyle = badgeGradient;
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 25);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 18px "Poppins", sans-serif';
    ctx.fillText(quote.category.charAt(0).toUpperCase() + quote.category.slice(1), canvas.width / 2, badgeY + (badgeHeight / 2));
    
    // Add subtle branding
    ctx.fillStyle = '#2F2F2F';
    ctx.font = '400 24px "Inter", sans-serif';
    ctx.fillText('QuoteFlow', canvas.width / 2, canvas.height - 80);
    
    // Convert to data URL
    resolve(canvas.toDataURL('image/png'));
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
