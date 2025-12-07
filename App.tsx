import React, { useState, useCallback } from 'react';
import { DesignState, FabricType, ClothingStyle, Size, FitType, SelectionItem, Measurements, GeneratedImages } from './types';
import { FABRICS, STYLES, SIZES, FITS } from './constants';
import { checkAndRequestApiKey, generateClothingImages } from './services/geminiService';
import { StepWizard } from './components/StepWizard';
import { SelectionCard } from './components/SelectionCard';
import { MeasurementInput } from './components/MeasurementInput';

const INITIAL_STATE: DesignState = {
  fabric: null,
  style: null,
  size: null,
  measurements: { bust: 0, hips: 0, gender: 'Female' }, // Default gender
  fit: null,
};

function App() {
  const [step, setStep] = useState(1);
  const [design, setDesign] = useState<DesignState>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 6));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateMeasurement = (key: keyof Measurements, value: any) => {
    setDesign(prev => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value }
    }));
  };

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
    
    try {
      // 1. Check API Key permission/selection for Veo/Imagen models
      const apiKeyReady = await checkAndRequestApiKey();
      if (!apiKeyReady) {
         // If user cancelled or failed to select, stop here.
         setIsGenerating(false);
         return;
      }

      // 2. Generate
      const images = await generateClothingImages(design);
      
      console.log('生成的图片结果:', images);
      console.log('Front:', images.front);
      console.log('Side:', images.side);
      console.log('Back:', images.back);
      console.log('Price:', images.price);
      console.log('Front是否为null:', images.front === null);
      console.log('Front是否为undefined:', images.front === undefined);
      console.log('Front长度:', images.front?.length);
      
      if (!images.front) {
        throw new Error("Failed to generate front image. Please try again.");
      }
      
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError("An error occurred during generation. Please ensure you have a valid API Key selected.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 1: // Fabric
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FABRICS.map((fabric) => (
              <SelectionCard
                key={fabric.id}
                title={fabric.name}
                image={fabric.image}
                selected={design.fabric?.id === fabric.id}
                onClick={() => setDesign({ ...design, fabric })}
              />
            ))}
          </div>
        );
      case 2: // Style
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {STYLES.map((style) => (
              <SelectionCard
                key={style.id}
                title={style.name}
                image={style.image}
                selected={design.style?.id === style.id}
                onClick={() => setDesign({ ...design, style })}
              />
            ))}
          </div>
        );
      case 3: // Size
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <h3 className="text-xl font-serif mb-8">选择标准尺寸</h3>
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setDesign({ ...design, size })}
                  className={`py-4 text-xl font-medium border-2 rounded-lg transition-all
                    ${design.size === size 
                      ? 'border-primary bg-primary text-white shadow-lg scale-105' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        );
      case 4: // Measurements
        return (
          <div className="max-w-md mx-auto">
            <div className="flex gap-4 mb-8 justify-center">
              {(['Female', 'Male'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => updateMeasurement('gender', g)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                    ${design.measurements.gender === g ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {g === 'Female' ? '女' : '男'}
                </button>
              ))}
            </div>

            <MeasurementInput
              label="胸围/胸部周长"
              value={design.measurements.bust}
              onChange={(v) => updateMeasurement('bust', v)}
              min={70}
              max={130}
              guide={design.measurements.gender === 'Female' ? "标准: 80-100cm" : "标准: 90-110cm"}
            />
            
            <MeasurementInput
              label="臀部周长"
              value={design.measurements.hips}
              onChange={(v) => updateMeasurement('hips', v)}
              min={70}
              max={130}
              guide={design.measurements.gender === 'Female' ? "标准: 85-105cm" : "标准: 85-105cm"}
            />
          </div>
        );
      case 5: // Fit
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <h3 className="text-xl font-serif mb-8">选择所需版型</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
              {FITS.map((fit) => (
                <button
                  key={fit}
                  onClick={() => setDesign({ ...design, fit })}
                  className={`p-6 text-left border-2 rounded-lg transition-all group
                    ${design.fit === fit 
                      ? 'border-primary bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <span className={`block text-lg font-medium mb-1 ${design.fit === fit ? 'text-primary' : 'text-gray-800'}`}>
                    {fit === 'Slim Fit' ? '紧身款' : fit === 'Regular Fit' ? '常规款' : fit === 'Loose/Oversized' ? '宽松款' : '裁剪款'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {fit === 'Slim Fit' && '紧身贴身轮廓。'}
                    {fit === 'Regular Fit' && '标准舒适裁剪。'}
                    {fit === 'Loose/Oversized' && '宽松轻盈轮廓。'}
                    {fit === 'Tailored' && '精致结构设计。'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case 6: // Generate
        if (generatedImages) {
          return (
             <div className="animate-fade-in">
               <h3 className="text-2xl font-serif text-center mb-8">您的定制设计</h3>
               <div className="flex justify-center">
                 <div className="w-full max-w-sm">
                   <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] shadow-md flex flex-col relative group">
                      {generatedImages.front ? (
                        <>
                          <img 
                            src={generatedImages.front} 
                            alt="正面" 
                            className="w-full h-full object-contain bg-white" 
                            onError={(e: any) => {
                              console.error("正面 图片加载失败:", generatedImages.front);
                              e.currentTarget.src = `https://placehold.co/768x1024/f0f0f0/999?text=Front`;
                            }}
                          />
                          {/* 预览按钮 - 悬停时显示 */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {!generatedImages.front.includes('placehold.co') && (
                              <button
                                onClick={() => window.open(generatedImages.front, '_blank')}
                                className="bg-white/90 hover:bg-white text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                title="预览图片"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                预览
                              </button>
                            )}
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded text-nowrap">
                            {generatedImages.front.includes('placehold') ? '' : generatedImages.front.match(/\d+x\d+/) ? generatedImages.front.match(/\d+x\d+/)[0] : ''}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">图片暂时无法加载</div>
                      )}
                   </div>
                   <span className="text-center text-sm font-medium uppercase tracking-wider text-gray-500 block mt-2">正面</span>
                 </div>
               </div>
               
               {/* 价格信息 */}
               <div className="mt-12 bg-gradient-to-r from-primary/10 to-black/10 p-8 rounded-xl border border-primary/20">
                 <div className="flex items-center justify-between mb-4">
                   <h4 className="text-lg font-serif text-primary">定价计算</h4>
                   <div className="text-xs text-gray-500"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                   <div>
                     <dt className="text-gray-600 mb-1">面料</dt>
                     <dd className="text-primary font-medium">{design.fabric?.name || '-'}</dd>
                   </div>
                   <div>
                     <dt className="text-gray-600 mb-1">尺寸</dt>
                     <dd className="text-primary font-medium">{design.size || '-'}</dd>
                   </div>
                   <div>
                     <dt className="text-gray-600 mb-1">版型</dt>
                     <dd className="text-primary font-medium">{design.fit === 'Slim Fit' ? '紧身款' : design.fit === 'Regular Fit' ? '常规款' : design.fit === 'Loose/Oversized' ? '宽松款' : '裁剪款'}</dd>
                   </div>
                   <div>
                     <dt className="text-gray-600 mb-1">性别</dt>
                     <dd className="text-primary font-medium">{design.measurements.gender === 'Female' ? '女' : '男'}</dd>
                   </div>
                 </div>
                 <div className="border-t border-gray-300 pt-4 space-y-3">
                   <div className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 p-3 rounded">
                     <span className="text-gray-700 font-medium">布料成本</span>
                     <span className="text-lg text-primary font-semibold">¥{((generatedImages.price || 50) - 50)}</span>
                   </div>
                   <div className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10 p-3 rounded">
                     <span className="text-gray-700 font-medium">工艺服务费</span>
                     <span className="text-lg text-primary font-semibold">¥50</span>
                   </div>
                   <div className="flex items-center justify-between border-t border-gray-300 pt-3">
                     <span className="text-lg text-gray-800 font-bold">总价格</span>
                     <span className="text-4xl font-bold text-primary">¥{generatedImages.price || 0}</span>
                   </div>
                   <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                     注：布料用量根据尺寸、版型、身材调整
                   </div>
                 </div>
               </div>
               
               <div className="mt-12 text-center">
                 <button 
                   onClick={() => { setGeneratedImages(null); setStep(1); setDesign(INITIAL_STATE); }}
                   className="px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-full font-medium"
                 >
                   设计另一件服装
                 </button>
               </div>
             </div>
          );
        }

        return (
          <div className="max-w-xl mx-auto">
             <h3 className="text-2xl font-serif text-center mb-6">检查并定制</h3>
             <div className="bg-gray-50 p-8 rounded-xl mb-8 border border-gray-100">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                  <div>
                    <dt className="text-gray-500">面料</dt>
                    <dd className="font-medium text-lg text-primary">{design.fabric?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">款式</dt>
                    <dd className="font-medium text-lg text-primary">{design.style?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">尺寸</dt>
                    <dd className="font-medium text-lg text-primary">{design.size}</dd>
                  </div>
                   <div>
                    <dt className="text-gray-500">版型</dt>
                    <dd className="font-medium text-lg text-primary">{design.fit}</dd>
                  </div>
                  <div className="col-span-2 pt-4 border-t border-gray-200">
                    <dt className="text-gray-500 mb-1">量体数据</dt>
                    <dd className="font-medium text-primary">
                      {design.measurements.gender === 'Female' ? '女' : '男'} • 胸围: {design.measurements.bust}cm • 臀围: {design.measurements.hips}cm
                    </dd>
                  </div>
                </dl>
             </div>

             {error && (
               <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 text-sm text-center">
                 {error}
               </div>
             )}

             <div className="text-center">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`w-full py-4 text-white text-lg font-medium tracking-wide rounded-lg shadow-xl transition-all
                    ${isGenerating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-black hover:scale-[1.01]'}`
                  }
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      定制服饰正在生成中...
                    </span>
                  ) : "一键定制"}
                </button>
                <p className="mt-4 text-xs text-gray-400">
                  由豆包Seedream-4.5 AI提供支持。生成正面、侧面和背面视图。
                </p>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !design.fabric;
      case 2: return !design.style;
      case 3: return !design.size;
      case 4: return !design.measurements.bust || !design.measurements.hips;
      case 5: return !design.fit;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="py-6 px-8 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => {
              setStep(1);
              setDesign(INITIAL_STATE);
              setGeneratedImages(null);
              setError(null);
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            title="返回第一步"
          >
            <div className="w-8 h-8 bg-primary rounded-tr-xl rounded-bl-xl"></div>
            <h1 className="text-2xl font-serif font-bold text-primary tracking-tight">TailorAI</h1>
          </button>
          <nav>
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">邓总-智能高级定制</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <StepWizard currentStep={step} />

        <div className="min-h-[400px]">
           {renderContent()}
        </div>
      </main>

      {/* Footer Navigation (Sticky) */}
      {!generatedImages && (
        <div className="sticky bottom-0 bg-white border-t border-gray-100 py-6 px-4 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={step === 1 || isGenerating}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-colors
                ${step === 1 || isGenerating ? 'opacity-0 cursor-default' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              上一步
            </button>
            
            {step < 6 && (
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`px-10 py-3 bg-primary text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105
                  ${isNextDisabled() ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
              >
                下一步
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default App;