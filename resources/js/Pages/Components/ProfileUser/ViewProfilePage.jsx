import React from "react";

import ViewProfileLayer from "./ViewProfileLayer";
import { usePage } from '@inertiajs/react';

const ViewProfilePage = () => {
  const { auth } = usePage().props;

  return (
    <>
     

        {/* ViewProfileLayer */}
        <ViewProfileLayer user={auth.user} />

    
    </>
  );
};

export default ViewProfilePage; 
