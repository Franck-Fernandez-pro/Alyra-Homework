import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useVoting } from "../hooks";
import { useConnectedWallet } from "../hooks";
import logoUrl from "../assets/logo.png";
import alyraLogoUrl from "../assets/alyra.png";

function NavBar() {
  const { userStatus } = useVoting();
  const { userAddress } = useConnectedWallet();

  const statusTranslation = () => {
    if (userStatus === "owner") {
      return "Propriétaire";
    }
    if (userStatus === "voter") {
      return "Élécteur";
    }
    return "Invité";
  };

  return (
    <div className="navbar bg-base-100 flex justify-center">
      <div className="flex w-full justify-start">
        <img className="h-10" src={alyraLogoUrl} alt="school logo" />
      </div>
      <div className="flex w-full justify-center">
        <img className="h-24 rounded-2xl" src={logoUrl} alt="app logo" />
      </div>
      <div className="flex w-full flex-col items-end">
        <div className="flex flex-col items-center">
          <ConnectButton />
          {userAddress && (
            <span>
              Bonjour ! Vous êtes{" "}
              <b className="text-primary">{statusTranslation()}</b>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
