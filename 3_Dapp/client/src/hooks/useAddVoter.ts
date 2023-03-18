import { useVoting } from "./useVoting";
import { isAddress } from "../utils/inputs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function useAddVoter() {
  const { voting } = useVoting();

  const addVoterToContract = async (inputAddress: string) => {
    if (isAddress(inputAddress)) {
      try {
        const response = await voting?.addVoter(inputAddress);
        console.log("RESPONSE ADD VOTER ", response);
        toast.success("Élécteur ajouté");
      } catch (err) {
        toast.error("Erreur du smart contract");
      }
    } else {
      toast.error("Ce n'est pas une adresse");
      console.error("Not an address");
    }
  };

  return { addVoterToContract };
}
