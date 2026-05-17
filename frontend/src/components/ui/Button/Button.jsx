import React from 'react';
import styles from './Button.module.css';
import Spinner from '../Spinner';

/**
 * Reusable Button component
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'link'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.isLoading]
 * @param {string} [props.className]
 * @param {React.ElementType} [props.as='button']
 */
const Button = ({ variant = 'primary', size = 'md', isLoading, disabled, className = '', children, as: Component = 'button', ...props }) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={classNames} disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner className={styles.spinner} />}
      <span className={isLoading ? styles.hiddenText : ''}>{children}</span>
    </Component>
  );
};

export default Button;
