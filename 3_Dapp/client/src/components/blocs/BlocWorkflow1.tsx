import { ChangeEvent, useEffect, useState } from "react";
import { useAddVoter, useConnectedWallet, useVoting } from "../../hooks";

function BlockWorkflow1() {
  const [inputAddress, setInputAddress] = useState<string>("");

  const { userStatus } = useVoting();
  const { addVoterToContract } = useAddVoter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputAddress(e.currentTarget.value);
  };

  const handleClickAdd = () => {
    console.log("SEND ", inputAddress);
    addVoterToContract(inputAddress);
    setInputAddress("");
  };

  return (
    <>
      {userStatus === "owner" && (
        <div className="flex flex-col items-center justify-center gap-2">
          <input
            className="input input-bordered w-full max-w-xs"
            type="text"
            value={inputAddress}
            onChange={handleInputChange}
            placeholder="Adresse du futur élécteur (0x00...)"
          />
          <button className="btn btn-primary" onClick={handleClickAdd}>
            ajouter
          </button>
        </div>
      )}
      {userStatus === "voter" && (
        <div className="alert alert-success shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 flex-shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Vous avez été ajouté en tant qu'élécteur, vous pourrez interragir
            aux prochaines étapes !
          </span>
        </div>
      )}
    </>
  );
}

export default BlockWorkflow1;
