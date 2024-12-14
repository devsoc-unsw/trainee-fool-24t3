import { UserGroupIcon } from '@heroicons/react/24/outline';
import Button from '../../../../Button/Button';
import { ButtonIcons, ButtonVariants } from '../../../../Button/ButtonTypes';
import { TextInput, TextOptions } from '../../../../TextInput/TextInput';
import { SettingsPage } from '../../SettingsPage';
import { useState } from 'react';

export const CreateNewSocietyPage = () => {
  const [societyName, setSocietyName] = useState('');
  const [error, setError] = useState('');

  const createSociety = async (societyName: string) => {
    const society = await fetch('http://localhost:5180/society', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name: societyName }),
    });

    const societyJson = await society.json();

    if (society.ok) {
      setError('');
      console.log(societyJson);
    } else {
      setError(societyJson.message);
    }
  };

  return (
    <SettingsPage
      title="Create a new society"
      pageAbovePath="/settings/societies"
      headerButtons={[
        <Button
          variant={ButtonVariants.Primary}
          icon={ButtonIcons.Plus}
          type="button"
          onClick={() => createSociety(societyName)}
        />,
      ]}
    >
      <TextInput
        placeholder="Society name"
        name="societyName"
        type={TextOptions.Text}
        onChange={(name) => setSocietyName(name)}
        icon={<UserGroupIcon />}
        error={error !== ''}
      />
      {error && <p>{error}</p>}
    </SettingsPage>
  );
};
