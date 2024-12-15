import { Link } from "react-router";
import { SettingsPage } from "../SettingsPage";
import Button from "../../../Button/Button";
import { ButtonIcons, ButtonVariants } from "../../../Button/ButtonTypes";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../UserContext/UserContext";

export function SocietyManagementPage() {
  const { societies, setSocieties } = useContext(UserContext);

  useEffect(() => {
    const getSocieties = async () => {
      const societies = await fetch("http://localhost:5180/user/societies", {
        method: "GET",
        credentials: "include",
      });

      if (societies.ok) {
        const societiesJson = await societies.json();
        setSocieties?.(societiesJson);
      } else {
        alert("Error loading societies.");
      }
    };

    getSocieties();
  }, []);

  return (
    <SettingsPage
      title="Societies you manage"
      headerButtons={[
        <Link to="/settings/societies/new">
          <Button
            variant={ButtonVariants.Secondary}
            icon={ButtonIcons.Plus}
            type="button"
          />
        </Link>,
      ]}
    >
      <section>
        <h2>Societies you've joined</h2>
        <ul>
          {societies?.joined.map((society: any) => (
            <Link to={`/society/${society.id}`} key={society.id}>
              {society.name}
            </Link>
          ))}
        </ul>
      </section>
      <section>
        <h2>Societies you administer</h2>
        <ul>
          {societies?.administering.map((society: any) => (
            <li key={society.id}>
              {society.name} - ID {society.id}
            </li>
          ))}
        </ul>
      </section>
    </SettingsPage>
  );
}
