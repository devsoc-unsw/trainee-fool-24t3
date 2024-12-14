import { ChangeEvent, FormEventHandler, useContext, useEffect, useState } from "react";
import classes from "./SocietyDropdown.module.css";
import { Society, UserContext } from "../../UserContext/UserContext";

export function SocietyDropdown() {
    const { societies, setSocieties, setSociety } = useContext(UserContext);

    useEffect(() => {
      const getSocieties = async () => {
        const res = await fetch("http://localhost:5180/user/societies", {
          method: "Get",
          credentials: "include"
        });
        const json = await res.json();

        console.log(json);

        if(json) {
          setSocieties?.(json);
        }
    }
      getSocieties();
    },[]);

    const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
      const newSelection = event.target.value;
      const findSelection = societies?.administering.find((soc) => soc.name === newSelection);
      console.log(newSelection);
      if(findSelection) {
        setSociety?.(findSelection);
        console.log(findSelection);
      }
    };

    return (
        <div className={classes.container}>
        <label className={classes.label} htmlFor="society-select">Currently logged into...</label>
        <select name="societies" id="society-select" className={classes.select} onChange={handleSelect}>
          <option value="">--Choose a society to manage--</option>
          <hr />
          {societies && societies.administering.map((soc) => 
            <option className={classes.option} value={soc.name}>{soc.name}</option>
          )}
        </select>
      </div>
    );
}