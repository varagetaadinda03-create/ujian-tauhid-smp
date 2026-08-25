import React from 'react';

interface WatermarkProps {
  studentName: string;
  studentNis: string;
  studentNisn?: string;
  sessionId: string;
  className?: string;
}

export const Watermark: React.FC<WatermarkProps> = ({
  studentName,
  studentNis,
  studentNisn,
  sessionId,
  className = '',
}) => {
  const timestamp = new Date().toLocaleDateString('id-ID');
  const nisnLabel = studentNisn ? ` • NISN: ${studentNisn}` : '';
  const watermarkText = `${studentName}${nisnLabel} • NIS: ${studentNis} • SESS: ${sessionId} • ${timestamp}`;

  // Generate a matrix of watermark rows
  const items = Array.from({ length: 18 });

  return (
    <div
      id="exam-watermark-overlay"
      className={`fixed inset-0 pointer-events-none select-none z-20 overflow-hidden opacity-[0.045] flex flex-col justify-around rotate-[-18deg] scale-125 ${className}`}
      aria-hidden="true"
    >
      {items.map((_, i) => (
        <div key={i} className="flex justify-around whitespace-nowrap text-xs sm:text-sm font-mono font-bold tracking-widest text-slate-900">
          <span>{watermarkText}</span>
          <span className="hidden sm:inline">{watermarkText}</span>
          <span className="hidden md:inline">{watermarkText}</span>
        </div>
      ))}
    </div>
  );
};
