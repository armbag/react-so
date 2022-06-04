import { Button } from '../Button';
import './ErrorHandler.css';

interface IError {
  message: string;
}

export function ErrorHandler(props: IError) {
  return (
    <div className="err-container">
      <p className="err-message">{props.message}</p>
      <Button className="try-again" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
}
