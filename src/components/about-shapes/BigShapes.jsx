export default function Glyph({ type, size, color, opacity = 1, className = '', spin = '', style = {} }) {
  const bar = typeof size === 'number' ? Math.round(size / 12) : 10;
  const wrap = { width: size, height: size, ...style };
  return (
    <span className={`relative pointer-events-none select-none block will-change-transform ${spin} ${className}`} style={wrap} aria-hidden="true">
      {type === 'ring' && (
        <span className="block w-full h-full rounded-full" style={{ border: '2px solid ' + color, opacity }} />
      )}
      {type === 'square' && (
        <span className="block w-full h-full" style={{ border: '2px solid ' + color, opacity }} />
      )}
      {type === 'diamond' && (
        <span className="block w-full h-full rotate-45 rounded-lg" style={{ border: '2px solid ' + color, opacity }} />
      )}
      {type === 'cross' && (
        <>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: size, height: bar, background: color, opacity }} />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: bar, height: size, background: color, opacity }} />
        </>
      )}
      {type === 'asterisk' &&
        [0, 60, 120].map((a) => (
          <span
            key={a}
            className="absolute left-1/2 top-1/2"
            style={{ width: size, height: bar, background: color, opacity, transform: `translate(-50%, -50%) rotate(${a}deg)` }}
          />
        ))}
    </span>
  );
}