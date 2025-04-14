import React from 'react';
import './styles/Button.css';

interface ButtonInverseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export default function ButtonInverse({ label = "S'inscrire", ...props }: ButtonInverseProps) {
  return (
    <button className="btn-custom-inverse" {...props}>
      {label}
    </button>
  );
}
