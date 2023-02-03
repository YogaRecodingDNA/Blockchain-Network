import './index.css';
// import "./App.css";
import React from 'react';
import { createBrowserRouter, RouterProvider, Route, Outlet, createRoutesFromElements } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
// import App from './App';
// import NavBar from './components/NavBar';
import Header from './components/Header';
import HomePage from './routes/HomePage';
import ExplorerPage from './routes/ExplorerPage';
import BlocksPage from './routes/BlocksPage';
import TransactionsPage from './routes/TransactionsPage';

const Layout = () => {
  return (
    <div className="h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter(createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="explorer" element={<ExplorerPage />} />
      <Route path="blocks" element={<BlocksPage />} />
      <Route path="transactions" element={<TransactionsPage />} />
    </Route>
));

// const router = createBrowserRouter([
//   {
//     // path: "/",
//     element: <Layout />,
//     children: [
//       {
//         path: "/",
//         element: <HomePage />,
//       },
//       {
//         path: "/blocks",
//         element: <BlocksPage />,
//       },
//       {
//         path: "/transactions",
//         element: <TransactionsPage />,
//       }
//     ]
//   },
// ])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

);



  // <Provider store={store}>
  //   <App />
  // </Provider>