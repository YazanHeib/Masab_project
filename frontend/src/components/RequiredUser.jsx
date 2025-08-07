/* eslint-disable react/prop-types */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getMeAPI } from '../redux/api/getMeAPI';
import PageLoader from './PageLoader';

const RequiredUser = () => {
  const [cookies] = useCookies(['isLoggedIn']);
  const location = useLocation();

  const { data: user, isLoading, isFetching } = getMeAPI.endpoints.getMe.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });

  const loading = isLoading || isFetching;

  if (loading) {
    return <PageLoader />;
  }

  if (cookies.isLoggedIn || user) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RequiredUser;
