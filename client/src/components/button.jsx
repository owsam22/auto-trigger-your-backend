import styled from 'styled-components';

const Button = ({ children, as: Component = 'button', className, size = 'default', variant = 'primary', fullWidth = false, ...props }) => {
  return (
    <StyledWrapper className={`${className} size-${size} variant-${variant} ${fullWidth ? 'full-width' : ''}`}>
      <Component className="animated-button" {...props}>
        <span className="text">{children || 'Modern Button'}</span>
        <span className="circle" />
      </Component>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: inline-block;

  &.full-width {
    display: block;
    width: 100%;
  }

  &.full-width .animated-button {
    width: 100%;
    justify-content: center;
  }

  &.size-small .animated-button {
    padding: 8px 24px;
    font-size: 13px;
    border-radius: 8px;
  }

  &.size-small .animated-button:hover .circle {
    width: 140px;
    height: 140px;
  }

  .animated-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 34px;
    border: none;
    font-size: 15px;
    border-radius: 100px;
    font-weight: 700;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    text-decoration: none;
    line-height: 1;
    width: fit-content;
  }

  /* Primary (Solid) */
  &.variant-primary .animated-button {
    background-color: #6366f1;
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  &.variant-primary .animated-button .circle {
    background-color: #4f46e5; /* Darker indigo for hover */
  }

  /* Outline (Transparent) */
  &.variant-outline .animated-button {
    background-color: transparent;
    color: #6366f1;
    box-shadow: inset 0 0 0 2px #6366f1;
  }

  &.variant-outline .animated-button .circle {
    background-color: #6366f1;
  }

  /* Hover States */
  .animated-button:hover {
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  }

  &.variant-outline .animated-button:hover {
    box-shadow: inset 0 0 0 2px #6366f1, 0 8px 25px rgba(99, 102, 241, 0.4);
  }

  .animated-button .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 0;
  }

  .animated-button .text {
    position: relative;
    z-index: 1;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .animated-button:active {
    scale: 0.95;
    transform: translateY(0);
  }

  .animated-button:hover .circle {
    width: 100%;
    height: 400px;
    border-radius: 0;
    opacity: 1;
  }
`;

export default Button;
