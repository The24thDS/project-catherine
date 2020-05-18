import React, { useState } from "react";
import { EuiInputPopover, EuiFieldSearch } from "@elastic/eui";
import { useHistory } from "react-router-dom";

import ServerRequest from "../../../utils/ServerRequest";

import styles from "./SearchBar.module.sass";

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [value, setValue] = useState("");
  let history = useHistory();

  // TODO: Needs refactoring and bug fixing
  const search = async (value) => {
    const [firstName, lastName] = value.trim().split(" ");
    const searchPath = "/user/search";

    if (firstName === "") {
      setIsSearchOpen(false);
      setSearchResults("");
      return false;
    }

    if (lastName === undefined) {
      const firstNameSearch = new ServerRequest(searchPath, "POST", undefined, {
        firstName,
      });
      firstNameSearch.useAuthorization().useJsonBody();
      const lastNameSearch = new ServerRequest(searchPath, "POST", undefined, {
        lastName: firstName,
      });
      lastNameSearch.useAuthorization().useJsonBody();
      let response = await firstNameSearch.send();
      let data = await response.json();
      let searchResults = data.users;
      response = await lastNameSearch.send();
      data = await response.json();
      searchResults = [...searchResults, ...data.users];
      const uniqueSearchResultsIDs = new Set(
        searchResults.map((user) => user.id)
      );
      const uniqueSearchResults = searchResults.filter((user) => {
        if (uniqueSearchResultsIDs.has(user.id)) {
          uniqueSearchResultsIDs.delete(user.id);
          return true;
        }
        return false;
      });
      setSearchResults(
        uniqueSearchResults.length ? uniqueSearchResults : "No matching users"
      );
      setIsSearchOpen(true);
    } else {
      const firstSearch = new ServerRequest(searchPath, "POST", undefined, {
        firstName,
        lastName,
      });
      firstSearch.useAuthorization().useJsonBody();
      const secondSearch = new ServerRequest(searchPath, "POST", undefined, {
        firstName: lastName,
        lastName: firstName,
      });
      secondSearch.useAuthorization().useJsonBody();
      let response = await firstSearch.send();
      let data = await response.json();
      let searchResults = data.users;
      response = await secondSearch.send();
      data = await response.json();
      searchResults = [...searchResults, ...data.users];
      const uniqueSearchResultsIDs = new Set(
        searchResults.map((user) => user.id)
      );
      const uniqueSearchResults = searchResults.filter((user) => {
        if (uniqueSearchResultsIDs.has(user.id)) {
          uniqueSearchResultsIDs.delete(user.id);
          return true;
        }
        return false;
      });
      setSearchResults(
        uniqueSearchResults.length ? uniqueSearchResults : "No matching users"
      );
      setIsSearchOpen(true);
    }
  };

  return (
    <EuiInputPopover
      input={
        <EuiFieldSearch
          value={value}
          onChange={(ev) => {
            setValue(ev.target.value);
            search(ev.target.value);
          }}
          placeholder="Search in Project Catherine"
        />
      }
      isOpen={isSearchOpen && value !== ""}
      closePopover={() => setIsSearchOpen(false)}
      onFocus={() => {
        if (searchResults.length) setIsSearchOpen(true);
      }}
      style={{ width: "90vw" }}
    >
      {typeof searchResults === "string"
        ? searchResults
        : searchResults.map((user) => (
            <div
              className={styles["search-result"]}
              key={"user#" + user.id}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchResults("");
                setValue("");
                history.push("/user/" + user.id);
              }}
            >
              {user.firstName} {user.lastName}
            </div>
          ))}
    </EuiInputPopover>
  );
};

export default SearchBar;
