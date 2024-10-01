import Cookie from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;

export const getAccessToken = () => {
  return Cookie.get('accessToken');
};

export const getRefreshToken = () => {
  return Cookie.get('refreshToken');
};


export const setTokens = (accessToken: string, refreshToken: string, nome: string, email: string, cpf: string, id: number) => {
  const options = {
    expires: 1,
    sameSite: 'None', 
    domain: DOMAIN,
    path: '/'
  };

  Cookie.set('accessToken', accessToken, { ...options, secure: false, sameSite: undefined });
  Cookie.set('refreshToken', refreshToken, { ...options, expires: 7, secure: false, sameSite: undefined });
  Cookie.set('nome', nome, { ...options, secure: false, sameSite: undefined });
  Cookie.set('email', email, { ...options, secure: false, sameSite: undefined });
  Cookie.set('cpf', cpf, { ...options, secure: false, sameSite: undefined });
  Cookie.set('id', id.toString(), { ...options, secure: false, sameSite: undefined });
};

export const clearTokens = () => {
  const options = {
    domain: DOMAIN,
    path: '/'
  };

  const allCookies = Cookie.get();
  for (const cookieName of Object.keys(allCookies)) {
    Cookie.remove(cookieName,options);
  }
};

export const isAccessTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000; 
    return decodedToken.exp < currentTime; 
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return true; 
  }
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ROUTE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Falha ao renovar o token');
    }

    const data = await response.json();
    setTokens(data.accessToken, data.refreshToken, data.name, data.email, data.cpf, data.id);
    return data.accessToken;
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    clearTokens();
    throw error;
  }
};

export const isAuthenticated = async () => {

  const updateAccessToken = async (refreshToken: string): Promise<string | null> => {
    try {
      await refreshAccessToken(refreshToken);
      return getAccessToken() || null;
    } catch (error) {
      console.error('Erro ao atualizar o token de acesso:', error);
      return null;
    }
  };

  const checkAuth = async (): Promise<{ isAuthenticated: boolean; accessToken: string | null }> => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    
    if (accessToken && !isAccessTokenExpired(accessToken))
      return { isAuthenticated: true, accessToken };

    if (!refreshToken)
      return { isAuthenticated: false, accessToken: null };

    // Token expirado, tentar atualizar
    const newAccessToken = await updateAccessToken(refreshToken);
    return {
      isAuthenticated: newAccessToken !== null,
      accessToken: newAccessToken
    }
  };

  return await checkAuth();
};
