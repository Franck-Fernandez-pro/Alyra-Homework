import React, { useEffect, useState } from 'react';
import useEth from "../contexts/EthContext/useEth";

function NavBar (props) {
  const [userAddress, setUserAddress] = useState("- - -")
  const [userStatus, setUserStatus] = useState("- - -")
  const { state: { contract, accounts } } = useEth();

  // _checkOwner

  useEffect(() => {
    if (accounts) {
      console.log("acc", accounts);
      setUserAddress(accounts[0])
    }
  }, [accounts]);

  // useEffect(() => {
  //   if (contract) {
  //     // const isOwner = await contract._checkOwner.call({from: userAddress});
  //     console.log('isOwner', isOwner);
  //   }
  // }, [contract]);

  return (
    <div className="navbar bg-base-100 flex justify-between">
      <a className="btn btn-ghost normal-case text-xl">Alyra</a>
      <a className="btn btn-ghost normal-case text-xl">ChainVote</a>
      <div className="flex flex-col">
        <span>
          Bonjour: <b className="text-primary">{userAddress}</b>
        </span>
        <span>
          Vous êtes <b className="text-primary">owner</b>
        </span>
      </div>
      
    </div>
  );
}

export default NavBar;