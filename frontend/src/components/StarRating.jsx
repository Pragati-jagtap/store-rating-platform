export default function StarRating({ value, onChange, readonly = false, size = '1.1rem' }) {
  return (
    <div className="stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (value || 0) ? 'filled' : 'empty'} ${readonly ? 'readonly' : ''}`}
          onClick={() => !readonly && onChange && onChange(star)}
          title={readonly ? `${value}/5` : `Rate ${star}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
