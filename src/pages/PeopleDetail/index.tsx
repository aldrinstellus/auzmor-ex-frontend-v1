import React from 'react';
import { useParams } from 'react-router-dom';
interface IPeopleDetailProps {}

const PeopleDetail = (props: IPeopleDetailProps) => {
  const params = useParams();
  return <div>PeopleDetail Page {params.userId}</div>;
};

export default PeopleDetail;
