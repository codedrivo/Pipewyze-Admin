import React from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import classes from "./SearchBox.module.scss";

function SearchBox() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (val) {
        newParams.set("search", val);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  };

  return (
    <div className={classes.searchBox}>
      <Icon
        icon='fluent:search-28-filled'
        width='14'
        style={{ fontWeight: "bold" }}
      />
      <input
        type='search'
        placeholder={t("search")}
        name='search'
        value={searchValue}
        onChange={handleChange}
        className={classes.searchBox_input}
      />
    </div>
  );
}

export default SearchBox;
