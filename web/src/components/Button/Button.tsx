import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  pressed: boolean;
  onClick: (value: string) => void;
  value: string;
}

export function Button(props: ButtonProps): JSX.Element {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const value = (event.target as HTMLInputElement).value;
    props.onClick(value);
  };

  return (
    <button
      value={props.value}
      className={`${styles.button} ${
        props.pressed ? styles.buttonPressed : ''
      }`}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
}
