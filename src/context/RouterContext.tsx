import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string, replace?: boolean) => void;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  params: {},
  searchParams: new URLSearchParams()
});

export const useRouter = () => useContext(RouterContext);

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [path, setPath] = useState(() => window.location.pathname);
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, replace = false) => {
    if (to === path) return;

    if (replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    const url = new URL(window.location.href);
    setPath(url.pathname);
    setSearchParams(url.searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to extract dynamic params (e.g. /sample/:id or /download/:orderId)
  let params: Record<string, string> = {};
  if (path.startsWith('/sample/')) {
    const parts = path.split('/');
    if (parts[2]) params.id = parts[2];
  } else if (path.startsWith('/download/')) {
    const parts = path.split('/');
    if (parts[2]) params.orderId = parts[2];
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params, searchParams }}>
      {children}
    </RouterContext.Provider>
  );
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  className?: string;
  children: ReactNode;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, className, children, replace, onClick, ...rest }) => {
  const { navigate, path } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to, replace);
    }
  };

  const isActive = path === to || (to !== '/' && path.startsWith(to));

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      data-active={isActive ? 'true' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
};
