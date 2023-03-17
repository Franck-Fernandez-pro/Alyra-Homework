function WorkflowStatus({ status, label }: { status: string; label: string }) {
  const getStatusStyle = () => {
    if (status === 'done') return 'badge-primary';
    if (status === 'current') return 'badge-secondary';
    return '';
  };

  const getStatusText = () => {
    if (status === 'done') return 'Complété';
    if (status === 'current') return 'En cours';
    return 'En attente';
  };

  return (
    <div className="flex w-full">
      <p className="text-end w-full pr-5">{label}</p>
      <div className={`badge w-32 text-white gap-2 ${getStatusStyle()}`}>
        {getStatusText()}
      </div>
    </div>
  );
}

export default WorkflowStatus;
