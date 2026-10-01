import React from 'react';
import { createPortal } from 'react-dom';

const sidePositions = ['top-[18%]', 'top-1/2 -translate-y-1/2', 'bottom-[18%]'];

export const SpinningDollarSigns: React.FC = () => createPortal(
  <div className="spinning-dollar-layer fixed inset-0 z-[2] overflow-hidden pointer-events-none" aria-hidden="true">
    {[0, 1].map((side) => (
      <div key={side} className={`spinning-dollar-side absolute inset-y-0 ${side === 1 ? 'spinning-dollar-side-right' : ''}`}>
        {sidePositions.map((position, index) => (
          <div
            key={position}
            className={`dollar-coin absolute left-1/2 -translate-x-1/2 ${position}`}
          >
            <img src="/assets/HEHE.png" alt="" draggable={false} className="dollar-coin-face dollar-coin-front" />
            <img src="/assets/HEHE.png" alt="" draggable={false} className="dollar-coin-face dollar-coin-back" />
          </div>
        ))}
      </div>
    ))}
  </div>,
  document.body,
);