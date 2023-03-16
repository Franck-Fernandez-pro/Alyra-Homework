import { useVoting } from './useVoting';
import { isAddress } from '../utils/inputs';

export function useAddVoter() {
  const { voting } = useVoting();
  
  const addVoterToContract = async (inputAddress: string) => {
    if (isAddress(inputAddress)) {
      const response = await voting?.addVoter(inputAddress);
      console.log('RESPONSE ADD VOTER ', response);
    } else {
      console.error("Not an address");
    }
  }

  return { addVoterToContract }
}
