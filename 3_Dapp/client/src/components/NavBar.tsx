import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSigner } from 'wagmi';
import { useVoting } from '../hooks';
import { useVotingGetters } from '../hooks/useVotingGetters';
import { useConnectedWallet } from '../hooks';

function NavBar () {
  const { userStatus } = useVotingGetters();
  const { userAddress } = useConnectedWallet();

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