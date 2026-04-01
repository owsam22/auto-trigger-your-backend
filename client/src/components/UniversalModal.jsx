import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const UniversalModal = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = 480,
  padding = 32,
  animate = true
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', 
          inset: 0, 
          zIndex: 1000,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '24px',
          pointerEvents: 'auto'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute', 
              inset: 0,
              background: 'rgba(0,0,0,0.6)', 
              backdropFilter: 'blur(8px)',
            }}
          />
          
          {/* Modal Container ("The One Box") */}
          <motion.div
            initial={animate ? { opacity: 0, scale: 0.95, y: 20 } : {}}
            animate={animate ? { opacity: 1, scale: 1, y: 0 } : {}}
            exit={animate ? { opacity: 0, scale: 0.95, y: 20 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'relative', 
              zIndex: 1001, 
              width: '100%', 
              maxWidth: maxWidth,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 24, 
              padding: padding,
              boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
              overflow: 'hidden'
            }}
          >
            {/* Close Button */}
            <button 
              className="universal-close-btn"
              type="button"
              onClick={onClose}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: 'transparent', border: 'none',
                cursor: 'pointer', color: '#94a3b8',
                padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s', zIndex: 1002
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#475569'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              <X size={20} />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
