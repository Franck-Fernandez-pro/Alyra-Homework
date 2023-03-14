import React from 'react';

function WorkflowStatus (props) {
  const getStatusStyle = () => {
    if (props.status === "done") { return "bg-lime-500" }
    if (props.status === "current") { return "bg-sky-700" }
    return "bg-stone-500";
  }

  const getStatusText = () => {
    if (props.status === "done") { return "Complété" }
    if (props.status === "current") { return "En cours" }
    return "En attente";
  }

  return (
    <div className="w-full flex">
      <p className="w-full text-end pr-5">{props.label}</p>
      <div className='flex w-full items-start pl-5'>
        <div className={`text-white rounded-full px-2 ${getStatusStyle()}`}>
          {getStatusText()}
        </div> 
      </div>
    </div>
  );
}

export default WorkflowStatus;