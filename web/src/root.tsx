import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix';
import type { LinksFunction, MetaFunction } from 'remix';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import rootCSS from './root.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: bootstrap },
    { rel: 'stylesheet', href: rootCSS },
  ];
};

export const meta: MetaFunction = () => {
  return { title: 'Task Manager' };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
