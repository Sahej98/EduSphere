import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className='loading-screen'>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <img
          src='/logo.png'
          style={{ width: '80px', height: '80px', marginBottom: '1.5rem' }}
          alt='Logo'
        />
        <div className='startup-spinner'></div>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>EduSphere</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Waking up server... (this may take up to 30s)
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
