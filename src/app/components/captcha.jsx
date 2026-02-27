import { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';





export function Captcha({ onValidate }) {
  const canvasRef = useRef(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValidated, setIsValidated] = useState(false);

  // Generate random CAPTCHA text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput('');
    setIsValidated(false);
    onValidate(false);
    return text;
  };

  // Draw CAPTCHA on canvas
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f0f9ff');
    gradient.addColorStop(0.5, '#e0f2fe');
    gradient.addColorStop(1, '#bae6fd');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise (dots)
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }

    // Add random lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw CAPTCHA text with styling
    const colors = ['#1e40af', '#1e3a8a', '#3730a3', '#4338ca', '#4f46e5', '#6366f1'];
    const spacing = canvas.width / (text.length + 1);

    for (let i = 0; i < text.length; i++) {
      // Random color for each character
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

      // Random font size and style
      const fontSize = 28 + Math.random() * 8;
      const fontWeight = Math.random() > 0.5 ? 'bold' : 'normal';
      const fontStyle = Math.random() > 0.7 ? 'italic' : 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px Arial, sans-serif`;

      // Calculate position with some randomness
      const x = spacing * (i + 1) - 10 + (Math.random() - 0.5) * 10;
      const y = 35 + (Math.random() - 0.5) * 10;

      // Random rotation
      const rotation = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Add shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Add diagonal lines for extra security
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * canvas.height);
    ctx.lineTo(canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  };

  // Initialize CAPTCHA
  useEffect(() => {
    const text = generateCaptcha();
    drawCaptcha(text);
  }, []);

  // Redraw when CAPTCHA text changes
  useEffect(() => {
    if (captchaText) {
      drawCaptcha(captchaText);
    }
  }, [captchaText]);

  // Refresh CAPTCHA
  const handleRefresh = () => {
    const text = generateCaptcha();
    drawCaptcha(text);
  };

  // Validate input (case-insensitive)
  const handleInputChange = (value) => {
    setUserInput(value);

    // Case-insensitive comparison
    const isValid = value.toLowerCase() === captchaText.toLowerCase();
    setIsValidated(isValid);
    onValidate(isValid);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm">Security Check</label>
      
      {/* CAPTCHA Canvas */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={220}
            height={60}
            className="border-2 border-border rounded-lg shadow-sm" />
          
        </div>
        
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          title="Refresh CAPTCHA">
          
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter the characters above"
          className={`w-full px-4 py-3 bg-input-background border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
          userInput === '' ?
          'border-border focus:ring-primary' :
          isValidated ?
          'border-green-500 focus:ring-green-500' :
          'border-red-500 focus:ring-red-500'}`
          }
          autoComplete="off" />
        
        
        {/* Validation Icons */}
        {userInput !== '' &&
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValidated ?
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg> :

          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
          }
          </div>
        }
      </div>

      {/* Validation Message */}
      {userInput !== '' &&
      <p className={`text-xs ${isValidated ? 'text-green-600' : 'text-red-600'}`}>
          {isValidated ? '✓ CAPTCHA verified' : '✗ Characters do not match (case-insensitive)'}
        </p>
      }

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Enter the characters shown above. Not case-sensitive. Click refresh for a new code.
      </p>
    </div>);

}