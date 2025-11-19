import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadStarsPreset } from 'tsparticles-preset-stars';

export default function StarfieldBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadStarsPreset(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        preset: 'stars',
        background: { color: { value: "transparent" } },
        fullScreen: { enable: true, zIndex: 1 },
        particles: {
          number: { value: 18, density: { enable: true, area: 900 } },
          color: { value: "#e8e6ff" },
          opacity: {
            value: 0.6,
            random: { enable: true, minimumValue: 0.25 },
            animation: { enable: true, speed: 0.8, minimumValue: 0.12, sync: false },
          },
          size: { value: 1.4, random: { enable: true, minimumValue: 0.7 } },
          move: { enable: false },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.15,
              opacity: 1
            },
            lines: { enable: false }
          }
        }
      }}
    />
  );
}
