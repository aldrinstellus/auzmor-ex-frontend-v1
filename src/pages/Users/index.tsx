import { usePeople } from 'queries/people';
import React, { useState } from 'react';
interface IUsersProps {}

const Users: React.FC<IUsersProps> = () => {
  const [filters, setFilters] = useState({});
  const { data, status } = usePeople(filters);

  const users = data?.results;

  if (status === 'loading') {
    return <div>Loader...</div>;
  }

  return (
    <div>
      Users Page
      <div>
        {users.map((u: any) => (
          <div></div>
          // @ts-ignore
          // <UserCard {...u} />
        ))}
      </div>
    </div>
  );
};

export default Users;
