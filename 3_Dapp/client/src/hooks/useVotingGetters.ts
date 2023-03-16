import { useEffect, useState } from 'react';
import { useVoting } from '../hooks';
import { useConnectedWallet } from '../hooks';

export function useVotingGetters() {
  const [userStatus, setUserStatus] = useState<string>("");

  const { voting } = useVoting();
  const { userAddress } = useConnectedWallet()
  
  useEffect(() => {
    if (userAddress) {
      getUserStatus();
    }
  }, [userAddress]);

  const getUserStatus = async () => {
    const ownerAddr = await voting?.owner.call();
    if (ownerAddr === userAddress) {
      setUserStatus("owner");
      return;
    }

    try {
      const userData = await voting?.getVoter(userAddress);
      if (userData.isRegistered) {
        setUserStatus("voter");
        return;
      }
    } catch {
      setUserStatus("guest");
    }
    setUserStatus("guest");
  };

  return { userStatus };
}
