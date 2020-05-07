import React, { useState } from "react";
import { EuiInputPopover, EuiFieldSearch } from "@elastic/eui";

import ServerRequest from "../../../utils/ServerRequest";

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const onSearchType = async (evt) => {
    const text = evt.target.value;
    const [firstName, lastName] = text.trim().split(" ");
    const searchPath = "/user/search";

    console.log(firstName, lastName);

    if (firstName === "") {
      setIsSearchOpen(false);
      setSearchResults([]);
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
          onChange={onSearchType}
          placeholder="Search in Project Catherine"
        />
      }
      isOpen={isSearchOpen}
      closePopover={() => setIsSearchOpen(false)}
      onFocus={() => {
        if (searchResults.length) setIsSearchOpen(true);
      }}
      style={{ width: "90vw" }}
    >
      {typeof searchResults === "string"
        ? searchResults
        : searchResults.map((user) => (
            <div key={user.id}>
              {user.firstName} {user.lastName}
            </div>
          ))}
    </EuiInputPopover>
  );
};

export default SearchBar;
