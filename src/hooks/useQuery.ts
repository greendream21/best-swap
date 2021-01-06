import { useLocation } from 'react-router-dom';

import queryString from 'query-string';

const useQuery = () => {
  return queryString.parse(useLocation().search);
};

export default useQuery;
