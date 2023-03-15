function WorkflowStatus({ status, label }: { status: string; label: string }) {
  const getStatusStyle = () => {
    if (status === 'done') return 'bg-success';
    if (status === 'current') return 'bg-info';
    return 'bg-neutral';
  };

  const getStatusText = () => {
    if (status === 'done') return 'Complété';
    if (status === 'current') return 'En cours';
    return 'En attente';
  };

  return (
    <div className="flex w-full">
      <p className="text-end w-full pr-5">{label}</p>
      <div className="flex w-full items-start pl-5">
        <div className={`rounded-full px-2 text-white ${getStatusStyle()}`}>
          {getStatusText()}
        </div>
      </div>
    </div>
  );
}

export default WorkflowStatus;
