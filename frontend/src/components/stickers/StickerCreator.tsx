import React, { useState, useEffect } from 'react';
import './StickerCreator.css';

interface StickerCreatorProps {
  onStickerCreated: (stickerData: any) => void;
  onCancel: () => void;
}

const StickerCreator: React.FC<StickerCreatorProps> = ({ onStickerCreated, onCancel }) => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropSettings, setCropSettings] = useState({ x: 0, y: 0, width: 256, height: 256 });
  const [stickerName, setStickerName] = useState('');
  const [stickerTags, setStickerTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Efeito para limpar a URL do objeto quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Manipulador para upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar tipo de arquivo
      if (!file.type.match('image.*')) {
        setError('Por favor, selecione uma imagem válida.');
        return;
      }
      
      // Verificar tamanho do arquivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 2MB.');
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
      setStep(2);
    }
  };

  // Manipulador para ajuste de recorte
  const handleCropChange = (property: string, value: number) => {
    setCropSettings(prev => ({
      ...prev,
      [property]: value
    }));
  };

  // Manipulador para adição de tag
  const handleAddTag = (tag: string) => {
    if (tag && !stickerTags.includes(tag) && stickerTags.length < 5) {
      setStickerTags([...stickerTags, tag]);
    }
  };

  // Manipulador para remoção de tag
  const handleRemoveTag = (index: number) => {
    const newTags = [...stickerTags];
    newTags.splice(index, 1);
    setStickerTags(newTags);
  };

  // Manipulador para envio do sticker
  const handleSubmit = async () => {
    // Validações
    if (!image) {
      setError('Por favor, selecione uma imagem.');
      return;
    }
    
    if (!stickerName.trim()) {
      setError('Por favor, dê um nome ao seu sticker.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Em um ambiente de produção, isso seria uma chamada à API
      // Simulação de envio
      setTimeout(() => {
        // Criar objeto com dados do sticker
        const stickerData = {
          id: `sticker-${Date.now()}`,
          name: stickerName,
          tags: stickerTags,
          imageUrl: imagePreview,
          createdAt: new Date().toISOString(),
          status: 'pending_approval'
        };
        
        onStickerCreated(stickerData);
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      setError('Ocorreu um erro ao criar o sticker. Por favor, tente novamente.');
      setIsSubmitting(false);
    }
  };

  // Renderizar etapa atual
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="sticker-upload-step">
            <h3>Selecione uma Imagem</h3>
            <p>Escolha uma imagem para criar seu sticker. Recomendamos imagens quadradas com fundo transparente.</p>
            
            <div className="upload-area">
              <input
                type="file"
                id="sticker-image"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="sticker-image" className="file-label">
                <i className="icon-upload"></i>
                <span>Clique para selecionar ou arraste uma imagem</span>
                <small>PNG, JPG ou GIF (máx. 2MB)</small>
              </label>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="sticker-edit-step">
            <h3>Ajuste seu Sticker</h3>
            <p>Recorte e ajuste a imagem para criar seu sticker.</p>
            
            <div className="sticker-editor">
              <div className="sticker-preview">
                {imagePreview && (
                  <div className="image-container">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        transform: `translate(${-cropSettings.x}px, ${-cropSettings.y}px)`,
                        width: 'auto',
                        height: 'auto',
                        maxWidth: 'none'
                      }}
                    />
                    <div
                      className="crop-overlay"
                      style={{
                        width: `${cropSettings.width}px`,
                        height: `${cropSettings.height}px`
                      }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="sticker-controls">
                <div className="control-group">
                  <label>Posição X</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={cropSettings.x}
                    onChange={(e) => handleCropChange('x', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="control-group">
                  <label>Posição Y</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={cropSettings.y}
                    onChange={(e) => handleCropChange('y', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="control-group">
                  <label>Tamanho</label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    value={cropSettings.width}
                    onChange={(e) => {
                      const size = parseInt(e.target.value);
                      handleCropChange('width', size);
                      handleCropChange('height', size);
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="step-actions">
              <button className="back-button" onClick={() => setStep(1)}>Voltar</button>
              <button className="next-button" onClick={() => setStep(3)}>Próximo</button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="sticker-details-step">
            <h3>Detalhes do Sticker</h3>
            <p>Adicione informações sobre seu sticker.</p>
            
            <div className="sticker-form">
              <div className="form-group">
                <label htmlFor="sticker-name">Nome do Sticker</label>
                <input
                  type="text"
                  id="sticker-name"
                  value={stickerName}
                  onChange={(e) => setStickerName(e.target.value)}
                  maxLength={20}
                  placeholder="Dê um nome ao seu sticker"
                />
                <small>{stickerName.length}/20 caracteres</small>
              </div>
              
              <div className="form-group">
                <label>Tags (até 5)</label>
                <div className="tags-input">
                  <input
                    type="text"
                    placeholder="Adicionar tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleAddTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    disabled={stickerTags.length >= 5}
                  />
                  <div className="tags-container">
                    {stickerTags.map((tag, index) => (
                      <div key={index} className="tag">
                        {tag}
                        <button onClick={() => handleRemoveTag(index)}>&times;</button>
                      </div>
                    ))}
                  </div>
                </div>
                <small>Tags ajudam outros usuários a encontrar seu sticker</small>
              </div>
              
              <div className="sticker-final-preview">
                <div className="preview-container">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Sticker Preview"
                      className="sticker-image"
                      style={{
                        transform: `translate(${-cropSettings.x}px, ${-cropSettings.y}px)`,
                        width: 'auto',
                        height: 'auto',
                        maxWidth: 'none'
                      }}
                    />
                  )}
                </div>
                <div className="preview-name">{stickerName || 'Meu Sticker'}</div>
              </div>
            </div>
            
            <div className="step-actions">
              <button className="back-button" onClick={() => setStep(2)}>Voltar</button>
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={isSubmitting || !stickerName.trim()}
              >
                {isSubmitting ? 'Enviando...' : 'Criar Sticker'}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="sticker-creator">
      <div className="sticker-creator-header">
        <h2>Criar Novo Sticker</h2>
        <button className="close-button" onClick={onCancel}>&times;</button>
      </div>
      
      <div className="sticker-creator-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Upload</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Editar</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Detalhes</div>
        </div>
      </div>
      
      <div className="sticker-creator-content">
        {renderStep()}
      </div>
      
      {error && (
        <div className="sticker-creator-error">
          {error}
        </div>
      )}
      
      <div className="sticker-creator-footer">
        <p>Todos os stickers passam por moderação antes de serem aprovados.</p>
      </div>
    </div>
  );
};

export default StickerCreator;
