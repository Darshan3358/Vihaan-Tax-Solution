import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      {eyebrow && (
        <span className="inline-block text-xs uppercase tracking-widest font-bold text-brand-gold bg-brand-gold/10 px-3.5 py-1 rounded-full mb-3">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl font-extrabold tracking-tight font-sans ${
          light ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg max-w-2xl ${
            centered ? 'mx-auto' : ''
          } ${light ? 'text-slate-300' : 'text-brand-textMuted'}`}
        >
          {subtitle}
        </p>
      )}
      <div className={`mt-4 flex items-center gap-1.5 ${centered ? 'justify-center' : ''}`}>
        <div className="w-10 h-1 bg-brand-gold rounded-full" />
        <div className="w-2 h-1 bg-brand-blue rounded-full" />
      </div>
    </div>
  );
};
