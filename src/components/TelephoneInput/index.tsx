import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { usePhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import CountryList, { Country } from 'country-list-with-dial-code-and-flag';
import Button, { Size, Variant } from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Divider from 'components/Divider';

type TelephoneInputProps = {
  name: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  control?: Control<Record<string, any>>;
  dataTestId?: string;
  errorDataTestId?: string;
};

const TelephoneInput: React.FC<TelephoneInputProps> = ({
  name,
  label,
  className,
  disabled,
  control,
  dataTestId,
  errorDataTestId,
}): ReactElement => {
  const { field } = useController({
    name,
    control,
  });

  // Guess country and formatted phone by using the usePhoneInput hook
  const { country: countryIso2, phone: formattedPhone } = usePhoneInput({
    value: field.value || '',
  });

  // The defaultCountry will be equal to the country which we guessed using usePhoneInput
  const defaultCountry = CountryList.findOneByCountryCode(countryIso2);

  // If determining the defaultCountry is not possible for whatever reason,
  // fallbackCountry is determined by guessing the user's timezone from his browser.
  // If that fails as well, assume that the default country is United States.
  const fallbackCountry =
    CountryList.findOneByCountryCode(
      Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase(),
    ) || CountryList.findByCountryCode('us')[0];

  // The selectedCountry will either be defaultCountry or fallbackCountry,
  // whichever is truthy
  const selectedCountry = defaultCountry || fallbackCountry;

  // The updatedPhone is the formattedPhone that we got from the usePhoneInput hook,
  // after we remove the dial code.
  // const updatedPhone = useRef<string>();
  const updatedPhone = formattedPhone
    .replace(new RegExp(`^\\${selectedCountry.dialCode}`), '')
    .replaceAll(new RegExp(`[^0-9a-zA-Z]*$`, 'g'), '')
    .trim();

  // Every time updatedPhone changes, call the field.onChange method to update the value
  useEffect(() => {
    field.onChange(selectedCountry.dialCode + ' ' + updatedPhone);
  }, [updatedPhone]);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <div>
      <p className="text-sm text-neutral-900 font-bold truncate">{label}</p>
      <div className="flex items-center justify-between relative">
        <Button
          label={
            <div className="flex items-center justify-between gap-x-2">
              <div className="flex items-center gap-x-1">
                <p className="text-2xl">{selectedCountry.flag}</p>
                <p className="text-base">{selectedCountry.dialCode}</p>
              </div>
              <Icon name={showDropdown ? 'arrowUp' : 'arrowDown'} size={16} />
            </div>
          }
          variant={Variant.Secondary}
          size={Size.Small}
          onClick={() => setShowDropdown(!showDropdown)}
          className=" min-w-[96px] max-w-[96px] max-h-11"
          disabled={disabled}
          dataTestId={`${dataTestId}-countrycode`}
        />

        {showDropdown && (
          <Card className="absolute left-0 top-12 p-4 w-96 shadow-xl">
            <div className="flex relative items-center w-full">
              <div className="absolute ml-5">
                <Icon name="search" size={16} disabled />
              </div>
              <input
                placeholder="Country or code"
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-19xl border border-neutral-200 focus:outline-none h-12 pl-11"
              />
            </div>
            <div className="max-h-72 overflow-y-auto">
              {CountryList.getAll()
                .filter((item) =>
                  searchValue
                    ? [item.dialCode, item.name].some((val) =>
                        val.toLowerCase().includes(searchValue.toLowerCase()),
                      )
                    : item,
                )
                .map((item: Country, index: number) => (
                  <div
                    key={index}
                    className="py-4 cursor-pointer"
                    onClick={() => {
                      field.onChange(
                        (item.dialCode + ' ' + updatedPhone).trim(),
                      );
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-center gap-x-2 px-2">
                      <p>{item.flag}</p>
                      <p>{item.dialCode}</p>
                      <p>{item.name}</p>
                    </div>
                    <Divider />
                  </div>
                ))}
            </div>
          </Card>
        )}
        <input
          value={updatedPhone}
          onChange={(e) =>
            field.onChange(
              (selectedCountry.dialCode + ' ' + e.target.value).trim(),
            )
          }
          data-testid={`${dataTestId}-number`}
          className="ml-3 w-full rounded-19xl border border-neutral-200 focus:outline-none h-12 px-4"
        />
      </div>
    </div>
  );
};

export default TelephoneInput;
