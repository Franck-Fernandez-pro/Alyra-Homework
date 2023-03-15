import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSigner } from 'wagmi';
import { useVoting } from '../hooks';

function NavBar () {
  const [userAddress, setUserAddress] = useState("");
  const [userStatus, setUserStatus] = useState("");

  const {data: signer} = useSigner();
  const { voting } = useVoting();
  

  useEffect(() => {
    //@ts-ignore
    setUserAddress(signer?._address);
  }, [signer]);

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

  const statusTranslation = () => {
    if (userStatus === "owner") { return "Propriétaire" }
    if (userStatus === "voter") { return "Élécteur" }
    return "Invité"
  };

  return (
    <div className="navbar bg-base-100 flex justify-center">
      <div className="w-full flex justify-start">
        <img
          className="h-10"
          src="./alyra.svg"
          alt="school logo"
        />
      </div>
      <div className="w-full flex justify-center">
        <img
          className="h-24"
          src="./logo.png"
          alt="app logo"
        />
      </div>
      <div className="w-full flex flex-col items-end">
        <div className="flex flex-col items-center">
          <ConnectButton />
          { userAddress &&
            <span>
              Bonjour ! Vous êtes <b className="text-primary">{ statusTranslation() }</b>
            </span> 
          } 
        </div>
      </div>  
    </div>
  );
}

export default NavBar;