import { FC } from 'react';
import Collapse from 'components/Collapse';
import Spinner from 'components/Spinner';
import SwitchToggle from 'components/SwitchToggle';
import {
  useOrganization,
  useUpdateLimitGlobalPostingMutation,
} from 'queries/organization';
import queryClient from 'utils/queryClient';
import Divider from 'components/Divider';

const GeneralSettings: FC = () => {
  const updateLimitPostingControlsMutation =
    useUpdateLimitGlobalPostingMutation();
  const { data, isLoading } = useOrganization();
  return (
    <Collapse
      defaultOpen
      label="Posting controls"
      headerTextClassName="text-base font-bold text-neutral-900"
      dataTestId="generalsetting-postingcontrols"
      height={125}
    >
      <div className="bg-white rounded-b-9xl px-6">
        <Divider />
        <div className="py-4 flex justify-between">
          <div className="flex flex-col">
            <div className="text-neutral-900 font-semibold text-sm">
              Limit global posting
            </div>
            <div
              className="text-xs text-neutral-900"
              data-testid="globalposting-helpnote"
            >
              When Global Posting is ON, end users can&apos;t post to everyone,
              only to their Team(s) or permitted Channels.
            </div>
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <SwitchToggle
              onChange={(checked: boolean, setChecked) =>
                updateLimitPostingControlsMutation.mutate(checked, {
                  onError: () => setChecked(!checked),
                  onSuccess: () =>
                    queryClient.invalidateQueries(['organization']),
                })
              }
              defaultValue={
                !!data?.adminSettings?.postingControls?.limitGlobalPosting
              }
              dataTestId="postingcontrols-globalposting-cta"
            />
          )}
        </div>
      </div>
    </Collapse>
  );
};

export default GeneralSettings;
