import { MouseEvent, ReactNode } from 'react';

const Card = ({
  title = '',
  children,
  onClick,
  btnDisabled = true,
}: {
  title: string;
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  btnDisabled?: boolean;
}) => (
  <div className="card bg-base-100 w-96 shadow-xl">
    <div className="card-body space-y-5">
      <h2 className="card-title">{title}</h2>
      {children && children}

      <div className="card-actions justify-end">
        <button
          className="btn btn-primary btn-sm"
          onClick={onClick}
          disabled={btnDisabled}
        >
          Ajouter
        </button>
      </div>
    </div>
  </div>
);

export default Card;
