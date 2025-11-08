import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../../data.json';
import './styles.css';

// Assets imports
import nebulaImg from './assets/nebula1.png';

import astronautImg from './assets/astronaut.png';
import spaceshipImg from './assets/spaceship.png';

import planet1Img from './assets/planet1.png';
import planet2Img from './assets/planet2.png';
import planet3Img from './assets/planet3.png';
import planet4Img from './assets/planet4.png';
import planet5Img from './assets/planet5.png';
import planet6Img from './assets/planet6.png';
import planet7Img from './assets/planet7.png';
import planet8Img from './assets/planet8.png';

// Floating astronaut animation
const floatingAnimation = {
  y: [0, -15, 0],
  transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
};

// Modal fade/scale variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3 } },
};

// Star component with twinkle animation delay
function Star({ x, y, size, twinkleDelay }) {
  return (
    <div
      className="star"
      style={{
        top: `${y}%`,
        left: `${x}%`,
        width: size,
        height: size,
        animationDelay: `${twinkleDelay}s`,
      }}
    />
  );
}

function GalaxyBackground() {
  const [stars] = useState(() =>
    Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: `${1 + Math.random() * 1.5}px`,
      delay: Math.random() * 5,
    }))
  );

  const [shootingStar, setShootingStar] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStar({
        top: Math.random() * 80 + 10,
        left: -5,
      });
      setTimeout(() => setShootingStar(null), 1500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="galaxy-background">
      {/* Single nebula image */}
      <img src={nebulaImg} alt="Nebula" className="nebula-layer" />

      {/* Test stars */}
        <div className="star" style={{ top: '10%', left: '10%', width: '3px', height: '3px', animationDelay: '0s' }} />
        <div className="star" style={{ top: '40%', left: '50%', width: '2px', height: '2px', animationDelay: '1s' }} />
        <div className="star" style={{ top: '70%', left: '80%', width: '1.5px', height: '1.5px', animationDelay: '2s' }} />

        {stars.map((star, i) => (
          <Star key={i} x={star.x} y={star.y} size={star.size} twinkleDelay={star.delay} />
        ))}

      {/* Stars */}
      {stars.map((star, i) => (
        <Star key={i} x={star.x} y={star.y} size={star.size} twinkleDelay={star.delay} />
      ))}

      {/* Shooting star */}
      <AnimatePresence>
        {shootingStar && (
          <motion.div
            className="shooting-star"
            initial={{ top: shootingStar.top + '%', left: shootingStar.left + '%' }}
            animate={{ left: '120%', top: shootingStar.top - 10 + '%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ isOpen, onClose, title, content }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div className="modal-content" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={e => e.stopPropagation()}>
            <h2 id="modal-title">{title}</h2>
            <div className="modal-scrollable-content">{content}</div>
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Planet({ planetData, onClick }) {
  const [hovered, setHovered] = useState(false);
  const satellites = Array(6)
    .fill(0)
    .map((_, i) => ({
      angle: i * 60,
      delay: i * 0.2,
    }));

  return (
    <motion.div
      className={`planet-container ${hovered ? 'hovered' : ''}`}
      style={{ top: planetData.position.top, left: planetData.position.left }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open ${planetData.label} section`}
      onKeyDown={e => {
        if (e.key === 'Enter') onClick();
      }}
    >
      <motion.img
        key={planetData.label}
        className="planet"
        src={planetData.image}
        alt={`${planetData.label} planet`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: planetData.rotationDuration || 60, ease: 'linear' }}
      />
      <div className="planet-label">{planetData.label}</div>

      {hovered && (
        <>
          <div className="planet-glow" />
          {satellites.map((s, i) => (
            <motion.div
              key={i}
              className="satellite-sparkle"
              style={{ transform: `rotate(${s.angle}deg) translateX(40px) rotate(-${s.angle}deg)`, animationDelay: `${s.delay}s` }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

function Astronaut({ introContent, onContactClick }) {
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <div className="astronaut-container" style={{ top: '50%', left: '35%', transform: 'translate(-50%, -50%)', position: 'absolute', zIndex: 20 }}>
      <motion.img
        src={astronautImg}
        alt="Floating astronaut"
        className="astronaut"
        animate={floatingAnimation}
        onMouseEnter={() => setDialogVisible(true)}
        onMouseLeave={() => setDialogVisible(false)}
        tabIndex={0}
        onFocus={() => setDialogVisible(true)}
        onBlur={() => setDialogVisible(false)}
      />

      <AnimatePresence>
        {dialogVisible && (
          <motion.div className="intro-dialog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            {introContent}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        src={spaceshipImg}
        alt="Spaceship - click to contact"
        className="spaceship"
        onClick={onContactClick}
        tabIndex={0}
        role="button"
        aria-label="Open contact modal"
        onKeyDown={e => {
          if (e.key === 'Enter') onContactClick();
        }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      />

      {/* <svg className="light-trail" aria-hidden="true" width="500" height="500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute', top: 0, left: 0, pointerEvents: 'none', userSelect: 'none', zIndex: 15}}>
        <path
          d="M175 250 Q 320 300 450 500"
          stroke="#a5b1ffaa"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg> */}

    </div>
  );
}

function ThemeSwitcher({ currentTheme, themes, onThemeSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="theme-switcher" onClick={() => setOpen(!open)} tabIndex={0} role="button" aria-label="Open theme switcher" onKeyDown={e => e.key === 'Enter' && setOpen(!open)}>
      <div className="glowing-globe" />
      <AnimatePresence>
        {open && (
          <motion.ul className="theme-dropdown" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {themes.filter(t => t !== currentTheme).map(t => (
              <li key={t} tabIndex={0} onClick={() => { onThemeSelect(t); setOpen(false); }} onKeyDown={e => e.key === 'Enter' && (onThemeSelect(t), setOpen(false))}>
                <div className="theme-preview" />
                {t}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GalaxyTheme() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState(null);
  const [currentTheme] = useState('Galaxy');

  const onThemeSelect = themeName => {
    alert(`Theme switch to ${themeName} - implement routing or dynamic import for real app.`);
  };

  const openModalForSection = sectionKey => {
    setModalSection(sectionKey);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSection(null);
  };

  // Modal content from data.json
  const modalContent = () => {
    if (!modalSection) return null;
    if (modalSection === 'contact') {
      const contact = data.contact;
      return (
        <div className="contact-content">
          <p>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
          <p>Phone: {contact.phone}</p>
          <p>Socials:</p>
          <ul>{Object.entries(contact.socials).map(([key, link]) => (<li key={key}><a href={link} target="_blank" rel="noreferrer">{key}</a></li>))}</ul>
        </div>
      );
    }
    const content = data[modalSection];
    if (!content) return <p>No content available.</p>;

    if (modalSection === 'skills') {
      return Object.entries(content).map(([cat, skills]) => (
        <div key={cat}>
          <h3>{cat}</h3>
          <ul>{skills.map((s, i) => (<li key={i}>{s}</li>))}</ul>
        </div>
      ));
    }

    if (Array.isArray(content)) {
      return content.map((item, i) => (
        <div key={i} className="modal-item">
          {item.title && <h3>{item.title}</h3>}
          {item.name && <h3>{item.name}</h3>}
          {item.degree && <h3>{item.degree}</h3>}
          {item.company && <p><i>{item.company}</i></p>}
          {item.institution && <p><i>{item.institution}</i></p>}
          {item.duration && <p>{item.duration}</p>}
          {item.period && <p>{item.period}</p>}
          {item.description && <p>{item.description}</p>}
          {item.issuer && <p>Issuer: {item.issuer} ({item.year})</p>}
          {item.link && <p><a href={item.link} target="_blank" rel="noreferrer">Project Link</a></p>}
        </div>
      ));
    }

    if (typeof content === 'string') return <p>{content}</p>;

    if (modalSection === 'stats') {
      const stats = content.techGrowth;
      return (
        <div className="stats-chart">
          {stats.map(({ year, skillLevel }, i) => (
            <div key={i} className="stats-bar-container">
              <div className="stats-bar" style={{ height: skillLevel + '%' }}>
                <span>{skillLevel}%</span>
              </div>
              <div className="stats-year">{year}</div>
            </div>
          ))}
        </div>
      );
    }

    return <p>Content not formatted yet.</p>;
  };

  const planets = [
    { key: 'about', label: 'About', image: planet1Img, position: { top: '15%', left: '75%' }, rotationDuration: 50, modalKey: 'about' },
    { key: 'skills', label: 'Skills', image: planet2Img, position: { top: '50%', left: '85%' }, rotationDuration: 65, modalKey: 'skills' },
    { key: 'experience', label: 'Experience', image: planet3Img, position: { top: '77%', left: '75%' }, rotationDuration: 80, modalKey: 'experience' },
    { key: 'projects', label: 'Projects', image: planet4Img, position: { top: '80%', left: '50%' }, rotationDuration: 70, modalKey: 'projects' },
    { key: 'education', label: 'Education', image: planet5Img, position: { top: '50%', left: '7%' }, rotationDuration: 60, modalKey: 'education' },
    { key: 'certifications', label: 'Certifications', image: planet6Img, position: { top: '12%', left: '20%' }, rotationDuration: 90, modalKey: 'certifications' },
    { key: 'extraCurricular', label: 'Extra-Curricular', image: planet7Img, position: { top: '75%', left: '25%' }, rotationDuration: 55, modalKey: 'extraCurricular' },
    { key: 'stats', label: 'Stats', image: planet8Img, position: { top: '10%', left: '50%' }, rotationDuration: 75, modalKey: 'stats' },
  ];

  return (
    <div className="galaxy-theme-container">
      <GalaxyBackground />
      <ThemeSwitcher currentTheme={currentTheme} themes={data.themes} onThemeSelect={onThemeSelect} />
      <Astronaut introContent={data.intro} onContactClick={() => openModalForSection('contact')} />
      {planets.map(planet => (
        <Planet key={planet.key} planetData={planet} onClick={() => openModalForSection(planet.modalKey)} />
      ))}
      <Modal isOpen={modalOpen} onClose={closeModal} title={modalSection ? modalSection.charAt(0).toUpperCase() + modalSection.slice(1) : ''} content={modalContent()} />
    </div>
  );
}
