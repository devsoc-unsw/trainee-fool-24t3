import { UserGroupIcon } from '@heroicons/react/24/outline';
import Button from '../../../../Button/Button';
import { ButtonIcons, ButtonVariants } from '../../../../Button/ButtonTypes';
import { TextInput, TextOptions } from '../../../../TextInput/TextInput';
import { SettingsPage } from '../../SettingsPage';
import { useContext, useEffect, useState } from 'react';
import { Society, UserContext } from '../../../../UserContext/UserContext';
import classes from './SearchSocieties.module.css';

export const SearchSocietiesPage = () => {
  const [societyName, setSocietyName] = useState('');
  const [foundSocieties, setFoundSocieties] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { setSocieties } = useContext(UserContext);
  useEffect(() => {
    searchSocieties('');
  }, []);

  const searchSocieties = async (societyName: string) => {
    const societies = await fetch('http://localhost:5180/societies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const societiesJson = await societies.json();

    if (societies.ok) {
      setError('');
      setFoundSocieties(societiesJson);
      if (societyName) {
        setFoundSocieties(
          societiesJson.filter((society: Society) =>
            society.name.toLowerCase().includes(societyName.toLowerCase())
          )
        );
      }
    } else {
      setError(societiesJson.message);
      setSuccess('');
    }
  };

  return (
    <SettingsPage
      title="Join a society"
      pageAbovePath="/settings/societies"
      headerButtons={[
        <TextInput
          placeholder="Society name"
          name="societyName"
          type={TextOptions.Text}
          onChange={(name) => setSocietyName(name)}
          icon={<UserGroupIcon />}
          error={error !== ''}
          noMargin
        />,
        <Button
          variant={ButtonVariants.Primary}
          icon={ButtonIcons.Search}
          type="button"
          onClick={() => searchSocieties(societyName)}
        />,
      ]}
    >
      <ul className={classes.societiesList}>
        {foundSocieties.map((society: Society) => (
          <li key={society.id}>
            <h2>{society.name}</h2>
            <Button
              variant={ButtonVariants.Secondary}
              icon={ButtonIcons.Plus}
              type="button"
            />
          </li>
        ))}
      </ul>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </SettingsPage>
  );
};
