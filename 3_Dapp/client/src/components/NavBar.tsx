import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSigner } from 'wagmi';


function NavBar () {
  const [userAddress, setUserAddress] = useState("");
  const [userStatus, setUserStatus] = useState("- - -");

  const {data: signer} = useSigner();
  console.log('user addr', userAddress);

  useEffect(() => {
    //@ts-ignore
    setUserAddress(signer?._address);
  }, [signer]);

  // useEffect(() => {
  //   if (contract) {
  //     // const isOwner = await contract._checkOwner.call({from: userAddress});
  //     console.log('isOwner', isOwner);
  //   }
  // }, [contract]);

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
              Bonjour ! Vous êtes <b className="text-primary">owner</b>
            </span> 
          } 
        </div>
      </div>  
    </div>
  );
}

export default NavBar;