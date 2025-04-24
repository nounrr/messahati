import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const RouteScrollToTop = () => {
  const { url } = usePage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [url]);

  return null;
};

export default RouteScrollToTop;
