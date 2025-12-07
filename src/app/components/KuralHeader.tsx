"use client";

import { useState, useEffect } from "react";
import { THIRUKKURAL_TAMIL, isDevelopment } from "@/app/constants";
import Tooltip from "../common/Tooltip";

export default function KuralHeader() {
  const [currentKural, setCurrentKural] = useState<number>(
    Math.floor(Math.random() * THIRUKKURAL_TAMIL.length)
  );
  const [isLoading, setIsLoading] = useState(isDevelopment);
  const [isSetAsDefault, setIsSetAsDefault] = useState(false);

  useEffect(() => {
    if (!isDevelopment) {
      setIsLoading(false);
      return;
    }
    fetch("/api", {
      method: "GET",
      headers: {
        "x-file-name": "userPreferences",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          data.defaultKural !== undefined &&
          data.defaultKural !== null &&
          typeof data.defaultKural === "number"
        ) {
          setCurrentKural(data.defaultKural);
          setIsSetAsDefault(true);
        } else {
          setIsSetAsDefault(false);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading preferences:", err);
        setCurrentKural(Math.floor(Math.random() * THIRUKKURAL_TAMIL.length));
        setIsSetAsDefault(false);
        setIsLoading(false);
      });
  }, []);

  const handleKuralClick = async () => {
    if (!isDevelopment) return;
    if (isSetAsDefault) {
      setIsSetAsDefault(false);

      try {
        const response = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-file-name": "userPreferences",
          },
          body: JSON.stringify({
            defaultKural: null,
          }),
        });

        if (!response.ok) {
          console.error("Failed to remove defaultKural");
          setIsSetAsDefault(true);
        }
      } catch (error) {
        console.error("Error removing defaultKural:", error);
        setIsSetAsDefault(true);
      }
    } else {
      setIsSetAsDefault(true);

      try {
        const response = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-file-name": "userPreferences",
          },
          body: JSON.stringify({
            defaultKural: currentKural,
          }),
        });

        if (!response.ok) {
          console.error("Failed to update defaultKural");
          setIsSetAsDefault(false);
        }
      } catch (error) {
        console.error("Error updating defaultKural:", error);
        setIsSetAsDefault(false);
      }
    }
  };

  return (
    <Tooltip
      content={
        isDevelopment && isSetAsDefault
          ? "Click to Remove from default"
          : isDevelopment
          ? "Click to Set as default"
          : ""
      }
    >
      <p
        className={`mt-1 xl font-semi-bold ${isDevelopment ? "cursor-pointer" : ""} kural-text text-black ${
          isDevelopment && isSetAsDefault ? "kural-default" : ""
        }`}
        onClick={isDevelopment ? handleKuralClick : undefined}
      >
        {isLoading ? "Loading..." : THIRUKKURAL_TAMIL[currentKural].split(";")}
      </p>
    </Tooltip>
  );
}
