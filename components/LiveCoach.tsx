
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
// Fixed: Added Loader2 to imports from lucide-react
import { Mic, MicOff, Zap, BrainCircuit, MessageSquare, ShieldAlert, Sparkles, Activity, Loader2 } from 'lucide-react';
import { Trade } from '../types';

const LiveCoach: React.FC<{ trades: Trade[] }> = ({ trades }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState<{ user: string; ai: string }>({ user: '', ai: '' });
  const [volume, setVolume] = useState(0);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyzerRef = useRef<AnalyserNode | null>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
    setVolume(0);
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const outCtx = audioContextRef.current;
    const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = inCtx.createMediaStreamSource(stream);
            const analyzer = inCtx.createAnalyser();
            analyzer.fftSize = 256;
            analyzerRef.current = analyzer;
            source.connect(analyzer);
            
            const processor = inCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume detection for visualization
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length) * 100);
              
              sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(inputData) }));
            };
            source.connect(processor);
            processor.connect(inCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const audioData = decode(msg.serverContent.modelTurn.parts[0].inlineData.data);
              const buffer = await decodeAudioData(audioData, outCtx);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.inputTranscription) {
              setTranscription(prev => ({ ...prev, user: msg.serverContent!.inputTranscription!.text }));
            }
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => ({ ...prev, ai: msg.serverContent!.outputTranscription!.text }));
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopSession(),
          onerror: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are Adhyayan AI, an elite high-performance trading coach. 
          Your interface is the 'Antigravity' multimodal system. 
          Respond to the user's trading thesis or current emotional state. 
          If you detect voice tremors, rapid speech, or high pitch, point out that they may be experiencing 'Tilt' or 'FOMO'.
          Reference their recent performance if relevant: ${JSON.stringify(trades.slice(0, 3))}.
          KEEP RESPONSES EXTREMELY BRIEF (under 20 words) for low latency feel.`,
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      alert("Microphone access is required for Antigravity features.");
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="relative group mb-16">
        {/* Antigravity Orb Visualization */}
        <div className={`absolute -inset-12 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-full blur-3xl transition-all duration-700 opacity-20 ${isActive ? 'opacity-50 animate-pulse' : ''}`} style={{ transform: `scale(${1 + (volume / 200)})` }}></div>
        <div className={`relative w-56 h-56 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-500 ${isActive ? 'bg-slate-900 border-indigo-400 scale-105 shadow-[0_0_60px_rgba(99,102,241,0.5)]' : 'bg-slate-800 border-slate-700'}`}>
           {!isActive && !isConnecting ? (
             <BrainCircuit className="h-24 w-24 text-slate-500" />
           ) : isConnecting ? (
             <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mb-3" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Hydrating Session</span>
             </div>
           ) : (
             <div className="flex flex-col items-center">
                <div className="flex items-end gap-1 mb-4 h-12">
                   {[...Array(8)].map((_, i) => (
                     <div key={i} className="w-2 bg-indigo-500 rounded-full transition-all duration-75" style={{ height: `${20 + Math.random() * (volume * 1.5)}%` }}></div>
                   ))}
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Multimodal Live</span>
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase">Antigravity Trading Coach</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md font-medium">
          Speak your trade thesis aloud. The AI detects sentiment, stress, and logical fallacies in real-time.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-slate-900/80 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl mb-12 min-h-[140px] flex flex-col justify-center gap-4 relative">
         <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Transcription</span>
         </div>
         <p className="text-sm font-medium text-slate-700 dark:text-slate-200 italic leading-relaxed">
           {transcription.user ? `"${transcription.user}"` : "Say something like 'I'm thinking of entering Nifty at the breakout'..."}
         </p>
         {transcription.ai && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
               <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                 Coach: {transcription.ai}
               </p>
            </div>
         )}
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`group flex items-center gap-4 px-14 py-6 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl ${isActive ? 'bg-rose-600 text-white shadow-rose-500/30' : 'bg-indigo-600 text-white shadow-indigo-500/30 hover:scale-[1.03] active:scale-95'}`}
      >
        {isActive ? <><MicOff className="h-7 w-7" /> End Session</> : <><Mic className="h-7 w-7 group-hover:animate-bounce" /> Go Live</>}
      </button>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
         {[
           { label: 'Latency', value: '180ms', icon: Zap },
           { label: 'Emotion', value: 'Active', icon: BrainCircuit },
           { label: 'Security', value: 'Encrypted', icon: ShieldAlert },
           { label: 'Scale', value: 'Distributed', icon: Sparkles }
         ].map((item, i) => (
           <div key={i} className="p-5 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl mb-3"><item.icon className="h-4 w-4 text-indigo-500" /></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{item.value}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default LiveCoach;
