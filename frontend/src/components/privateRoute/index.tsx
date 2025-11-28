import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { chamadaLogin } from "../../services/endpoints/login";


interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const [auth, setAuth] = useState<null | boolean>(null);

  useEffect(() => {
    const verify = async () => {
      try {
       await chamadaLogin.validate( );
      
        setAuth(true);
      } catch {
        setAuth(false);
      }
    };

    verify();
  }, []);

  if (auth === null) return <div>Carregando...</div>;

  return auth ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
