import React, { useState, useRef, useEffect } from 'react';
import './PrysmsDrawCanvas.css';

interface PrysmsDrawCanvasProps {
  isDrawing: boolean;
  onSendDrawing?: (imageData: string) => void;
  readOnly?: boolean;
  receivedDrawingData?: string;
}

const PrysmsDrawCanvas: React.FC<PrysmsDrawCanvasProps> = ({
  isDrawing,
  onSendDrawing,
  readOnly = false,
  receivedDrawingData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

  // Inicializar o canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Configurar o canvas para ser responsivo
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      // Preencher com fundo branco
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setCtx(context);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Receber desenho de outro jogador
  useEffect(() => {
    if (!ctx || !receivedDrawingData || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = receivedDrawingData;
  }, [receivedDrawingData, ctx]);

  // Enviar desenho para outros jogadores
  useEffect(() => {
    if (!isDrawing || !onSendDrawing || !canvasRef.current) return;

    const sendDrawingInterval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const imageData = canvas.toDataURL('image/png');
      onSendDrawing(imageData);
    }, 500); // Enviar a cada 500ms para não sobrecarregar

    return () => {
      clearInterval(sendDrawingInterval);
    };
  }, [isDrawing, onSendDrawing]);

  // Funções de desenho
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly || !isDrawing || !ctx) return;

    setDrawing(true);

    // Obter posição do mouse/toque
    const pos = getPosition(e);
    setPosition(pos);

    // Começar um novo traço
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'pencil' ? color : '#ffffff';
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing || readOnly || !isDrawing || !ctx) return;

    // Prevenir scroll em dispositivos móveis
    e.preventDefault();

    // Obter nova posição
    const pos = getPosition(e);

    // Desenhar linha até a nova posição
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Atualizar posição
    setPosition(pos);
  };

  const stopDrawing = () => {
    if (!drawing || !ctx) return;

    ctx.closePath();
    setDrawing(false);
  };

  // Função auxiliar para obter posição do mouse/toque
  const getPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    // Verificar se é evento de mouse ou toque
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Limpar o canvas
  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="prysms-draw-canvas-container">
      {isDrawing && !readOnly && (
        <div className="drawing-tools">
          <div className="tool-group">
            <button 
              className={`tool-button ${tool === 'pencil' ? 'active' : ''}`}
              onClick={() => setTool('pencil')}
            >
              Lápis
            </button>
            <button 
              className={`tool-button ${tool === 'eraser' ? 'active' : ''}`}
              onClick={() => setTool('eraser')}
            >
              Borracha
            </button>
          </div>
          
          <div className="tool-group">
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={tool === 'eraser'}
            />
            
            <div className="brush-size">
              <span>Tamanho:</span>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <button className="clear-button" onClick={clearCanvas}>
            Limpar Tudo
          </button>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {readOnly && (
        <div className="read-only-overlay">
          <p>Aguardando seu turno para desenhar...</p>
        </div>
      )}
    </div>
  );
};

export default PrysmsDrawCanvas;
