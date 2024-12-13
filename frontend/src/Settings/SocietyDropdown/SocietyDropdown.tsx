import { useEffect, useState } from "react";
import classes from "./SocietyDropdown.module.css";

export function SocietyDropdown() {
    const [societies, setSocieties] = useState([]);

    useEffect(() => {
      fetch
    },[]);

    return (
        <div className={classes.container}>
        <label className={classes.label} htmlFor="society-select">Choose a society</label>
        <select name="societies" id="society-select">
          <option value="">--Choose a society to manage--</option>
          <hr />
        </select>
      </div>
    );
}