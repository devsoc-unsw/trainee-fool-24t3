import { UserGroupIcon } from "@heroicons/react/24/outline";
import Button from "../../../../Button/Button";
import { ButtonIcons, ButtonVariants } from "../../../../Button/ButtonTypes";
import { TextInput, TextOptions } from "../../../../TextInput/TextInput";
import { SettingsPage } from "../../SettingsPage";
import { useContext, useEffect, useState } from "react";
import { Society, UserContext } from "../../../../UserContext/UserContext";
import classes from "./SearchSocieties.module.css";

export const SearchSocietiesPage = () => {
  const [societyName, setSocietyName] = useState("");
  const [foundSocieties, setFoundSocieties] = useState([]);
  const [error, setError] = useState("");
  const { societies, setSocieties } = useContext(UserContext);
  useEffect(() => {
    searchSocieties("");
  }, []);

  const searchSocieties = async (societyName: string) => {
    const allSocieties = await fetch("http://localhost:5180/societies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const societiesJson = await allSocieties.json();

    const userSocieties = await fetch("http://localhost:5180/user/societies", {
      method: "GET",
      credentials: "include",
    });

    const userSocietiesJson = await userSocieties.json();
    setSocieties?.(userSocietiesJson);

    if (allSocieties.ok) {
      setError("");
      setFoundSocieties(societiesJson);
      if (societyName) {
        setFoundSocieties(
          societiesJson.filter((society: Society) =>
            society.name.toLowerCase().includes(societyName.toLowerCase())
          )
        );
      }
    } else {
      setError("Failed to fetch all societies.");
    }
  };

  const joinSociety = async (society: Society) => {
    const res = await fetch("http://localhost:5180/user/society/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ societyId: society.id }),
    });

    if (res.ok) {
      setSocieties?.({
        joined: [...(societies?.joined ?? []), society],
        administering: societies?.administering ?? [],
      });
    } else {
      alert("Failed to join society");
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
          error={error !== ""}
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
        {foundSocieties.map(
          (society: Society) =>
            !societies?.administering.some(
              (administeredSociety) => administeredSociety.name === society.name
            ) && (
              <li key={society.id}>
                <h2>{society.name}</h2>
                {!societies?.joined.some(
                  (joinedSociety) => joinedSociety.name === society.name
                ) ? (
                  <Button
                    variant={ButtonVariants.Secondary}
                    icon={ButtonIcons.Plus}
                    type="button"
                    onClick={() => {
                      joinSociety(society);
                    }}
                  />
                ) : (
                  <p>Already joined</p>
                )}
              </li>
            )
        )}
      </ul>
      {error && <p>{error}</p>}
    </SettingsPage>
  );
};
