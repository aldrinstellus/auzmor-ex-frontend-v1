import { FC, useState } from 'react';
import Card from 'components/Card';
import ConfigureDeel from './SSOSettings/components/ConfigureDeel';
// import { createSession } from 'pagess/Users';
import useAuth from 'hooks/useAuth';
import { useVault } from '@apideck/vault-react';
import Icon from 'components/Icon';
import { createConfiguration } from 'queries/intergration';
import { putConfiguration } from 'queries/intergration';

export const customOnClick = (
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setShow(!show);
};
const IntegrationSetting: FC = () => {
  const [ShowConfiguration, SetShowConfiguration] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const { user } = useAuth();
  // const { open } = useVault();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { open } = useVault();
  const openVault = () => {
    if (token) {
      open({ token });
    } else {
      createSession();
    }
  };
  const createSession = async (): Promise<void> => {
    if (!user) return;
    try {
      if (user) {
        const data = await createConfiguration('Deel');
        setIsConnected(true);
        if (data.token) {
          open({
            token: data.token,
            unifiedApi: 'hris',
            serviceId: 'deel',
            onClose: () => {
              console.log('closed!!!');
            },
            onReady: () => {
              console.log('ready!!!!');
            },
            onConnectionChange: () => {
              console.log('Changedddd!!!');
            },
          });
        }
        setToken(data.token);
        // second step will be open vault. - how do we call valt with payload.
        // third step is once authenticated by the valult fire the udpate API
      } else {
        console.error('User information is not available.');
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
    async()=> await putConfiguration();
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleReSyncClick = () => {
    customOnClick(ShowConfiguration, SetShowConfiguration);
    setShowDropdown(false);
  };

  return (
    <>
      {ShowConfiguration && (
        <ConfigureDeel
          show={ShowConfiguration}
          closeModal={() =>
            customOnClick(ShowConfiguration, SetShowConfiguration)
          }
        />
      )}
      <Card className="flex items-center py-5 px-4 justify-between">
        <div className="flex items-center">
          <div>
            <img
              src={require('images/DeelLogo.png')}
              alt="Deel Logo"
              className="h-[40px]"
            />
          </div>
          <div className="ms-3 text-sm font-medium p-3">
            <h5 className="text-lg font-semibold mb-0">Deel</h5>
            <p className="text-sm text-gray-600">
              Deel is a global HR platform that helps companies manage their
              international workforce.
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="bg-green-500 text-white text-sm px-4 py-2 rounded-full hover:bg-green-600 font-extrabold"
            onClick={openVault}
          >
            Configure
          </button>
          {isConnected && (
            <div className="relative">
              <button
                className="ml-2 p-2 rounded-full hover:bg-gray-200 text-extrabold text-xl"
                onClick={handleDropdownClick}
              >
                &#x22EE;
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg flex items-center justify-between">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={handleReSyncClick}
                  >
                    <Icon
                      name="tickCircle"
                      className="text-extrabold"
                      size={15}
                    />
                    Re-sync data
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default IntegrationSetting;
