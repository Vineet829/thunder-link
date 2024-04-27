import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllUsersQuery } from '@/graphql/query/user';
import { graphqlClient } from "@/clients/api";

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();
  const [names, setNames] = useState<any>([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await graphqlClient.request(getAllUsersQuery);
        setNames(result.getAllUsers);
      } catch (err) {
        console.log('Error occurred when fetching users');
      }
    })();
  }, []); // Removed the dependency [1] as it seemed to be a placeholder. If it was intentional, please adjust accordingly.

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value) {
      setSuggestions([]);
      return;
    }
    // Filter suggestions based on the input value
    const filteredSuggestions = names.filter((user: any) =>
      user.firstName.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  // Navigate to the user's profile
  const goToUserProfile = (UserId: any) => {
    router.push(`/${UserId}`);
    setQuery("");
  };

  return (
    <div className='searchContainer'>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search users..."
        className='searchInput'
      />
      {query && suggestions.length > 0 && (
        <ul className='suggestions'>
          {suggestions.map((suggestion: any) => (
            <li key={suggestion.id} onClick={() => goToUserProfile(suggestion.id)} className='suggestionItem'>
              {suggestion.firstName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
