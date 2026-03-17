import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, className = '', fluid = false }) => {
  return (
    <div className={`${fluid ? 'w-full px-6' : 'max-w-7xl mx-auto px-6'} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
