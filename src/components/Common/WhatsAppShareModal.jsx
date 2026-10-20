import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Phone, 
  Send,
  MessageCircle,
  Edit2
} from 'lucide-react';
import { openWhatsApp, cleanPhoneNumber } from '../../utils/whatsapp';

export default function WhatsAppShareModal({
  isOpen,
  onClose,
  title = "Share on WhatsApp",
  defaultPhone = "",
  customerName = "",
  initialMessage = ""
}) {
  if (!isOpen) return null;

  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState(initialMessage);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPhone(defaultPhone);
    setMessage(initialMessage);
    setIsEditing(false);
  }, [defaultPhone, initialMessage, isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    openWhatsApp(phone, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.115.556 4.101 1.533 5.828l-1.633 5.972 6.137-1.61c1.669.914 3.585 1.41 5.617 1.41 6.623 0 12-5.373 12-12 0-6.627-5.377-12-12-12zm0 21.848c-1.879 0-3.642-.533-5.143-1.458l-.369-.224-3.64.955.972-3.548-.246-.391c-1.014-1.613-1.574-3.493-1.574-5.467 0-5.421 4.409-9.83 9.83-9.83s9.83 4.409 9.83 9.83c0 5.422-4.409 9.83-9.83 9.83z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{title}</h3>
              <p className="text-[11px] text-zinc-400">
                {customerName ? `Recipient: ${customerName}` : 'Instant WhatsApp Dispatch'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-zinc-950/40">
          
          {/* Phone Number Input */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center space-x-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>Recipient WhatsApp Number</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-normal">
                Includes country code (e.g. +91)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 8848555675 or leave empty to choose contact in WhatsApp"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-xs font-mono font-medium transition"
              />
            </div>
            {!phone && (
              <p className="text-[10px] text-emerald-400/80 italic">
                * If no number is entered, WhatsApp will open your contact list to choose who to send to.
              </p>
            )}
          </div>

          {/* Message Preview Container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center space-x-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>WhatsApp Message Content</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] font-semibold text-zinc-400 hover:text-emerald-400 flex items-center space-x-1 transition"
              >
                <Edit2 className="h-3 w-3" />
                <span>{isEditing ? "Done Editing" : "Customise Text"}</span>
              </button>
            </div>

            {isEditing ? (
              <textarea
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-zinc-950 border border-emerald-500/40 text-zinc-200 text-xs font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 transition resize-y"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-[#0b141a] border border-zinc-800/90 text-zinc-200 text-xs font-sans leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin shadow-inner relative">
                {/* WhatsApp Chat Bubble Accent */}
                <div className="bg-[#1f2c34] p-3.5 rounded-xl rounded-tl-none border-l-2 border-emerald-500 text-zinc-100 shadow-md">
                  {message}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-zinc-400" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <div className="w-full sm:w-auto flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition transform active:scale-95 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
