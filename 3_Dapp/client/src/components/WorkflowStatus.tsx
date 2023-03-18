function WorkflowStatus({ status, label }: { status: string; label: string }) {
  const getStatusStyle = () => {
    if (status === "done") return "badge-primary";
    if (status === "current") return "badge-secondary";
    return "";
  };

  const getStatusText = () => {
    if (status === "done") return "Complété";
    if (status === "current") return "En cours";
    return "En attente";
  };

  return (
    <div className="flex w-3/4">
      <p className="text-start w-full pr-5">{label}</p>
      <div className={`badge w-32 gap-2 text-white ${getStatusStyle()}`}>
        {getStatusText()}
      </div>
    </div>
  );
}

export default WorkflowStatus;
