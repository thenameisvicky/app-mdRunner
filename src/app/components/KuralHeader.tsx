"use client";

import { useState, useEffect } from "react";
import { THIRUKKURAL_TAMIL } from "@/app/constants";
import Tooltip from "../common/Tooltip";
import { readPreferencesFromClient, writePreferencesToClient } from "../helpers/userPreference.client";
import { getUserPreferences, updateDefaultKural } from "../actions/dbActions";
import { isDevelopment } from "../constants";

export default function KuralHeader() {
  // Start with 0 to avoid hydration mismatch - will be updated in useEffect
  const [currentKural, setCurrentKural] = useState<number>(0);
  const [isSetAsDefault, setIsSetAsDefault] = useState(false);

  useEffect(() => {
    const loadDefaultKural = async () => {
      try {
        if (isDevelopment) {
          const data = await getUserPreferences();
          if (
            data.defaultKural !== undefined &&
            data.defaultKural !== null &&
            typeof data.defaultKural === "number" &&
            data.defaultKural >= 0 &&
            data.defaultKural < THIRUKKURAL_TAMIL.length
          ) {
            setCurrentKural(data.defaultKural);
            setIsSetAsDefault(true);
          } else {
            // Only use random after hydration
            setCurrentKural(Math.floor(Math.random() * THIRUKKURAL_TAMIL.length));
            setIsSetAsDefault(false);
          }
        } else {
          if (typeof window === "undefined") return;
          const prefs = readPreferencesFromClient();
          if (
            prefs.defaultKural !== undefined &&
            prefs.defaultKural !== null &&
            typeof prefs.defaultKural === "number" &&
            prefs.defaultKural >= 0 &&
            prefs.defaultKural < THIRUKKURAL_TAMIL.length
          ) {
            setCurrentKural(prefs.defaultKural);
            setIsSetAsDefault(true);
          } else {
            // Only use random after hydration
            setCurrentKural(Math.floor(Math.random() * THIRUKKURAL_TAMIL.length));
            setIsSetAsDefault(false);
          }
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
        // Only use random after hydration
        setCurrentKural(Math.floor(Math.random() * THIRUKKURAL_TAMIL.length));
        setIsSetAsDefault(false);
      }
    };
    loadDefaultKural();
  }, []);

  const handleKuralClick = async () => {
    const newIsSetAsDefault = !isSetAsDefault;
    setIsSetAsDefault(newIsSetAsDefault);
    
    try {
      if (isDevelopment) {
        await updateDefaultKural(newIsSetAsDefault ? currentKural : null);
      } else {
        if (typeof window === "undefined") return;
        const prefs = readPreferencesFromClient();
        prefs.defaultKural = newIsSetAsDefault ? currentKural : 0;
        writePreferencesToClient(prefs);
      }
    } catch (error) {
      setIsSetAsDefault(!newIsSetAsDefault);
      console.error(
        `Error ${newIsSetAsDefault ? "setting" : "removing"} defaultKural:`,
        error
      );
    }
  };

  return (
    <Tooltip
      content={
        isSetAsDefault
          ? "Click to Remove from default"
          : "Click to Set as default"
      }
    >
      <p
        className={`mt-1 xl font-semi-bold cursor-pointer kural-text text-black ${
          isSetAsDefault ? "kural-default" : ""
        }`}
        onClick={handleKuralClick}
      >
        {THIRUKKURAL_TAMIL[currentKural].split(";")}
      </p>
    </Tooltip>
  );
}
